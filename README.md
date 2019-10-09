



### Build
    docker build -t playback .


### Test
    docker run -p 80:80 playback



### Deploy to Heroku
    heroku login
    git push heroku master