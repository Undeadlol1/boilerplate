pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'docker-compose up —exit-code-from app —abort-on-container-exit'
            }
        }
    }
}