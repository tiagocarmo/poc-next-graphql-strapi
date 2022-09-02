if [ "$1" = "start" ]; then
  # starting node application
  exec node index.js
else
  # executing command supressed in the command line
  exec "$@"
fi