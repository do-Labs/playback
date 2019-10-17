#Playback App Documentation


### Docker Deployment

##### Build
    docker build -t playback .

##### Test
    docker run -p 80:80 playback


### Heroku Deployment

#### Config
    heroku login
    
#### Push to repo
    git push

#### Deploy
    git push heroku <branch-name>