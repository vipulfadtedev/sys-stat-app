pipeline {
    agent any
    stages {
        stage('Build Source') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }        
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t vipulfadtedev/sys-stat-app:latest .'
            }
        }
        stage('Tag Docker Image') {
            steps {
                sh 'docker ps'
            }
        }
        stage('Stop running container') {
            steps {
                sh 'docker stop `docker ps -aqf "name=sys-stat-app"`'
                sh 'docker rm `docker ps -aqf "name=sys-stat-app"`'
            }
        }
        stage('Start new container') {
            steps {
                sh 'docker run --name sys-stat-app --restart unless-stopped -dp 9090:8080 vipulfadtedev/sys-stat-app:latest'
            }
        }
    }
}