# GrandMajster
Web application, that helps you manage [Munchkin](https://munchkin.game) game sessions.

## Contents
- [Background of the project](#background)
- [Deployment public](#deployment-public)
- [Deployment local](#deployment-local)
- [Features](#features)
- [Development](#development)
## Background
I like [Munchkin](https://munchkin.game) - simple, yet fun and engaging card game, where you're exploring dungeons with equipment, fight with monsters and get treasures that you can use later in game. The most engaging part of the game are other players - they can help you, hinder you, conspire and trade. Only thing that you need to play is special deck of cards. The rule is simple - you need to climb to 10 lvl (there are variants with more levels to climb). While game is on, everyone has to write (or show) their statistics so that they can be seen by other players. This part may be frustrating or not entirely clear. **And suddenly this app comes in, all in white**.

There are alternatives on mobile devices but are limited only to one device (meaning that everyone need to write stats of every player, or one person write all stats, and the others look at this one device). And here we are with **synchronization**. Munchkin session helper allow to create and manage session on **game master device** and other players can join as spectators, to look for stats in game. Game master is obligated to add players and update their stats. Other payers are spectators - they can see changes in real time on their devices. Thanks to this solution, your session will be more smooth and clear. You can also join as a spectator on TV or projector, and display game stats there, so everybody will see stats on big screen.

## Deployment public
You may think `Wow, such a great idea!` (thanks for your opinion btw), but here come some steps that you need to make, to run this solution. You need to deploy this app on some public server to be accessible on the Internet, to allow other players to join. I'll try to help you to go through that process.
### Requirements
- VM (fe. Azure, AWS, Google Cloud);
- [Docker and docker-compose](https://docs.docker.com/compose/);
- (optional) Nginx, Apache (or other service to proxy connections to docker containers)
- [Certbot](https://certbot.eff.org) because access to the camera on the web is accessible only on `https` sites and you need camera, to scan QR Code, to add spectator devices.

### Usage
1. Clone this repo to some directory on your VM. Or you can just copy `docker-compose.yml` from the root of this project.
2. Copy `.env.template` from `server` folder and name it `.env`.
3. Copy `.config.json.template` from `frontend/public` folder and name it `config.json`.
4. Arrange files in folders. The structure in directory should look like this:
```
/
├─ docker-compose.yml
├─ server/
│   └─ .env
└─ config.json
```
5. Fill in `server/.env` file with neccessary informations (comments in file will explain everything).
6. Fill in `config.json` file with `url` parameter (that will be IP address or domain name of web socket server). For further configuration in this tutorial this url will be: `wss://munchkin-server.my_domain.com`.
7. Run this command in directory:
```
docker-compose up -d
```
8. If you want to serve app from alias of your domain, that is connected to your domain (fe. `my_domain.com`), add two new aliases (for this tutorial it will be `munchkin-app.my_domain.com` and `munchkin-server.my_domain.com`)
9. If you have nginx on your VM, go to `etc/nginx/conf.d` directory, create file with `*.conf` extension (fe. `munchkin.conf`), and fill it like this:
```nginx
server {

  server_name munchkin-app.my_domain.com;

  location / {
      proxy_pass http://0.0.0.0:4001/;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;
      proxy_redirect off;
      add_header Access-Control-Allow-Origin "http://munchkin-server.my_domain.com";
  }
}

server {
  server_name munchkin-server.my_domain.com;
  listen 2567;
  listen [::]:2567;

  location / {
      proxy_pass http://0.0.0.0:2568;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $connection_upgrade;
      proxy_set_header Host $host;
  }
}
```
10. Install [certbot](https://certbot.eff.org) on your VM.
11. Run this command for nginx (if you have other service installed, follow steps on [certbot](https://certbot.eff.org) page):
```sh
sudo certbot --nginx
```
12. From lists of your aliases check `munchkin-app.my_domain.com` and `munchkin-server.my_domain.com`. Certbot will automatically append configuration to your `munchkin.conf` file.
13. Restart nginx:
```sh
sudo service nginx restart
```
14. Done! When you visit `munchkin-app.my_domain.com` you will be greeted with start screen. Create session room, and let others join as spectators!
## Deployment local - in preparation...
> There is a way to run this app on your local network, and as long as other devices will be connected to that local network - they will gain access to app. But i need to find a best, simple way and describe it. So stay tuned!

## Features - in preparation...

## Development
You want to edit and contribute to the project? You're welcome, here are some steps that help you run solution in development mode:
1. Clone this repo
2. Copy `.env.template` from `server` folder and name it `.env`.
```properties
PORT=2567
NODE_ENV='debug'

LOBBY_LIMIT=10
SESSION_LIMIT=10

LOBBY_PLAYER_LIMIT=100
SESSION_PLAYER_LIMIT=100
```
3. Copy `.config.json.template` from `frontend/public` folder and name it `config.json`, and fill informations:
```json
{
  "url": "ws://localhost:2567"
}
```
4. Open `frontend/` and `server/` in separate IDE's to avoid IDE errors.
5. Open terminal, go to `server/` directory and type:
```bash
npm install
npm run debug
```
6. Open second terminal, go to `frontend/` and start:
```sh
npm install
npm run dev
```
7. In browser visit URL, that you'll se in console output :
```bash
» App URL................ http://192.168.0.126:9001/
                          http://localhost:9001/
```
8. Have fun!