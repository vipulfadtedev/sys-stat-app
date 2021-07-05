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
                sh 'docker build -t vipulfadtedev/sys-stat-app:$BUILD_NUMBER .'
            }
        }
        stage('Push Docker Image') {
            steps {
                sh 'docker push vipulfadtedev/sys-stat-app:$BUILD_NUMBER'
                sh 'docker tag vipulfadtedev/sys-stat-app:$BUILD_NUMBER vipulfadtedev/sys-stat-app:latest'
                sh 'docker push vipulfadtedev/sys-stat-app:latest'
            }
        }
        stage('Deploy') {
            steps {
                sh 'sed -i "s|#image#|vipulfadtedev/sys-stat-app:""$BUILD_NUMBER""|" deploy/deployment.yaml'
                sh '''kubectl apply -f deploy/namespace.yaml
                      kubectl apply -f deploy/deployment.yaml
                      kubectl apply -f deploy/service.yaml'''
            }
        }
    }
}