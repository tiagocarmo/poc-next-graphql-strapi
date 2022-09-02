import {
  message,
  danger,
  warn,
  fail
} from 'danger';

const serviceName = 'project-model-graphql-api';
const modifiedFiles = danger.git.modified_files;
const createdFiles = danger.git.created_files;

const findModifiedTestFiles = () => modifiedFiles.filter((file) => file.includes('test/'));

const findCreatedTestFiles = () => createdFiles.filter((file) => file.includes('test/'));

const findModifiedSourceFiles = () => modifiedFiles.filter((file) => file.includes('lib/'));

const findCreatedSourceFiles = () => createdFiles.filter((file) => file.includes('lib/'));

const allTestFiles = [];
allTestFiles.push(...findModifiedTestFiles());
allTestFiles.push(...findCreatedTestFiles());

const allSourceFiles = [];
allSourceFiles.push(...findModifiedSourceFiles());
allSourceFiles.push(...findCreatedSourceFiles());

const verifyTestChanges = async () => {
  if (allTestFiles.length) {
    allTestFiles.forEach(async (file) => {
      const diffTestFile = await danger.git.diffForFile(file);
      if (!diffTestFile.diff.includes('assert') && (!file.includes('fixture') && !file.includes('nocks'))) {
        warn(`🙅 Nenhum expect/assert foi adicionado no teste ${file}`);
      }
    });
  } else if (allSourceFiles.length) {
    warn('🙅 Nenhum teste foi criado ou atualizado para a nova implementação');
  }
};

const verifyDescriptionChanges = () => {
  if (!danger.github.pr.body) {
    warn('✍🏽 Escreva uma breve descrição do PR.');
  }
};

const findModifiedFile = (fileName) => {
  let file;
  modifiedFiles.forEach((modifiedFile) => {
    if (modifiedFile.includes(fileName)) {
      file = fileName;
    }
  });
  return file;
};

const verifyDocs = async () => {
  const packageDiff = await danger.git.JSONDiffForFile('package.json');
  if (packageDiff.version) {
    const version = packageDiff?.version?.after?.toLowerCase() || '';
    if (version.includes('-rc')) {
      fail('🤦 Versão com RC');
    }
    if (!findModifiedFile('CHANGELOG.md')) {
      warn('<strong>CHANGELOG.md</strong> deve ser atualizado com as features implementadas na versão');
    }
    if (!findModifiedFile('README.md')) {
      warn('<strong>README.md</strong> deve ser atualizado com as features implementadas na versão');
    }
  }
};

const findDiffDependencies = (diffDependencies, type = '') => {
  const newDevDependencies = [];
  const updatedDevDependencies = [];
  Object.keys(diffDependencies.after).forEach((devDependency) => {
    const versionBefore = diffDependencies.before[devDependency];
    const versionAfter = diffDependencies.after[devDependency];
    if (versionAfter && !versionBefore) {
      newDevDependencies.push(`${devDependency} - ${versionAfter.replace('^', '')}`);
    }
    if (versionBefore && versionAfter !== versionBefore) {
      updatedDevDependencies.push(
        `${devDependency} - De ${versionBefore.replace('^', '')} para ${versionAfter.replace('^', '')}`
      );
    }
  });
  if (newDevDependencies.length) {
    message(
      `Novas ${type} instaladas neste PR: <br/>`
      + ` ${newDevDependencies.join('<br/>')} `
    );
  }
  if (updatedDevDependencies.length) {
    message(
      `Atualização de ${type} que foram atualizadas neste PR: <br/>`
      + ` ${updatedDevDependencies.join('<br/>')} `
    );
  }
};

const verifyDevdependencies = async () => {
  const packageDiff = await danger.git.JSONDiffForFile('package.json');
  if (packageDiff.devDependencies) {
    findDiffDependencies(packageDiff.devDependencies, 'dependências de desenvolvimento');
  }
  if (packageDiff.dependencies) {
    findDiffDependencies(packageDiff.dependencies, 'dependências');
  }
};

const verifyImportantFiles = () => {
  const importantFiles = [
    'config.yml',
    'Dockerfile',
    'entrypoint.sh',
    '.eslintrc',
    '.mocharc.json',
    '.nycrc.json'
  ];
  importantFiles.forEach((file) => {
    if (findModifiedFile(file)) {
      message(`Atenção: O arquivo <strong>${file}</strong> foi atualizado.`);
    }
  });
};

const cleanStack = (string) => {
  let newString = string;
  newString = newString.replace('+      - ', '- ');
  newString = newString.replace('      - ', ' ');
  return newString;
};

const buildScriptMessage = async () => {
  const scriptMessage = [];
  if (findModifiedFile('package.json')) {
    const packageDiff = await danger.git.JSONDiffForFile('package.json');
    const stringPackageContent = await danger.github.utils.fileContents(findModifiedFile('package.json'));
    const objectPackageContent = JSON.parse(stringPackageContent);
    if (packageDiff.version && !packageDiff.version.after.includes('-rc')) {
      const versionMessage = `\n <strong>Microsserviço</strong>: ${serviceName} `
        + `\n <strong>Versão</strong>: ${objectPackageContent.version}`;
      scriptMessage.push(versionMessage);
    }
  }
  if (findModifiedFile(`${serviceName}-stack-hmg`)) {
    const diffStack = await danger.git.diffForFile(`stack/${serviceName}-stack-hmg.yml`);
    let stackMessage = '\n\n <strong>Modificações na stack</strong>: \n ';
    if (diffStack.removed) {
      stackMessage += `\n • Itens removidos: \n ${cleanStack(diffStack.removed)} `;
    }
    if (diffStack.added) {
      stackMessage += `\n • Itens adicionados: \n ${cleanStack(diffStack.added)} `;
    }
    scriptMessage.push(stackMessage);
  }
  if (scriptMessage.length) {
    const headerMessage = ' =================== Roteiro de Implantação =================== \n\n';
    const fullMessage = headerMessage + scriptMessage;
    message(fullMessage);
  } else {
    message('Nenhuma alteração na versão e no arquivo de stack!');
  }
};

const execValidation = async () => {
  verifyDescriptionChanges();
  await verifyTestChanges();
  await buildScriptMessage();
  if (findModifiedFile('package.json')) {
    verifyImportantFiles();
    await verifyDocs();
    await verifyDevdependencies();
  }
};

execValidation();
