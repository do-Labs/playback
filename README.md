#Playback App Documentation


### Docker Deployment

##### Build
    docker build -t playback .

##### Test
    docker run -p 80:80 playback


### Heroku Deployment
    Switch contexts:
        heroku git:remote --app <appname>

#### Config
    heroku login
    
#### Push to repo
    git push

#### Deploy
    git push heroku <branch-name>
    
#### Version History
    1.2.3 - Updates with custom questions, signIn, event mgmt
    1.2.2 - bugs fixed
    
    1.1.2 - Packaged for new temp domain and tweaks
    
    1.1.1 - completed stories for all feature development
            includes Ziggeo API Key env vars
    
    1.1.0
    
    1.0.0