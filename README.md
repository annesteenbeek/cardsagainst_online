# Cards against humanity online
An open source implementation of Cards against humanity, written in Node and using the Vue framework.

If you like this project, buy the original card game: https://www.cardsagainsthumanity.com/

The best description about the game is given by it's creators:

> Cards Against Humanity is a party game for horrible people. Unlike most of the party games you've played before, Cards Against Humanity is as despicable and awkward as you and your friends.
>
> The game is simple. Each round, one player asks a question from a black card, and everyone else answers with their funniest white card.

The game is designed to be both desktop and mobile friendly and supports chat, where you can have nice and friendly conversations.


### Desktop view
![Desktop screenshot](/screenshots/desktop.png)
### Mobile view
![Mobile screenshot](/screenshots/mobile.png)

## Description
This project contains both the front and backend. The backend is written in NodeJs and communication is done using SocketIO. 

## Running 
The easiest way to host this game yourself is using the provided docker container.
Make sure you have docker installed:

```
$ docker build -t cardsagainst . # to build
$ docker run -p 8001:8000 cardsagainst # to run
```


## Develop
If you want to add to, copy, delete or do whataver with this project, please do so.

The project is devided into a front and backend package.

First you should clone this project and cd into the folder.
```
$ git clone https://github.com/annesteenbeek/cardsagainst_online
$ cd cardsagainst_online
```

#### Frontend
The frontend is written using Vue

```
$ cd frontend
$ yarn install # get all the dependencies
$ npm run start # starts a dev server on localhost:8080
```

#### Backend
In order to run the backend:
```
$ cd backend
$ yarn install # get all the dependencies
$ npm run dev # run the dev server
```


## TODO
