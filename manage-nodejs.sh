#!/bin/bash

APP_NAME="BLOGAPI"
LOG_DIR="/var/log/blogapi"
NGINX_SERVICE="nginx"
PM2_NAME="BLOGAPI"

# create a log directory

# Ensure log directory exists
if [ ! -d "$LOG_DIR" ]; then
    echo "Log directory does not exist, creating $LOG_DIR..."
    sudo mkdir -p $LOG_DIR
    sudo chmod 755 $LOG_DIR
fi


#start app server

start_app() {
    echo "Starting $APP_NAME..."
    pm2 start $APP_NAME --name $PM2_NAME --log $LOG_DIR/pm2.log
    echo "$APP_NAME started."
}

#Stop app server
stop_app() {
    echo "Stopping $APP_NAME..."
    pm2 stop $PM2_NAME
    echo "$APP_NAME stopped."
}


#restering the server
restart_app() {
    echo "Restarting $APP_NAME..."
    pm2 restart $PM2_NAME
    echo "$APP_NAME restarted."
}
# Function to view logs
view_logs() {
    echo "Saving logs to $LOG_DIR/pm2.log..."
    tail -f $LOG_DIR/pm2.log >> $LOG_DIR/pm2.log &
}


# Check command line arguments
case $1 in
    start)
        start_app
        ;;
    stop)
        stop_app
        ;;
    restart)
        restart_app
        ;;
    logs)
        view_logs
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs}"
        exit 1
        ;;
esac