// REROUTE PORT 9000 TO PORT 80 BEFORE STARTING APP

sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000

// START APP WITH FOREVER AND NODEMON

forever start -c nodemon ./bin/www

// add these to start script of machine so it does it automatically upon start
//You should also edit your /etc/rc.local file and add that line minus the sudo. That will add the redirect when the machine boots up. You don't need sudo in /etc/rc.local because the commands there are run as root when the system boots.
