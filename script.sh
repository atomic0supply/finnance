#!/bin/bash

case "$1" in
  start)
    echo "Starting web..."
    npm run dev > web.log 2>&1 &
    echo $! > web.pid
    ;;
  stop)
    if [ -f web.pid ]; then
      PID=$(cat web.pid)
      echo "Stopping web (PID $PID)..."
      kill $PID && rm web.pid
    else
      echo "No running server."
    fi
    ;;
  status)
    if [ -f web.pid ]; then
      PID=$(cat web.pid)
      if ps -p $PID > /dev/null; then
        echo "Server running with PID $PID"
      else
        echo "Stale PID file found."
      fi
    else
      echo "Server not running."
    fi
    ;;
  reset)
    $0 stop
    $0 start
    ;;
  *)
    echo "Usage: $0 {start|stop|reset|status}"
    ;;
esac
