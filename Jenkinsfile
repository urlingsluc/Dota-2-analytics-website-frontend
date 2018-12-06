pipeline {
  agent any
  stages {
    stage('Verify Tools') {
      parallel {
        stage('node') {
          steps {
            sh 'npm -v'
          }
        }
        stage('docker') {
          steps {
            sh 'docker --version'
            sh 'which docker'
          }
        }
      }
    }
    stage('Build') {
      steps {
        sh 'npm prune'
        sh 'npm install'
        sh 'npm run build --prod'
      }
    }
    stage('Test') {
      steps {
        echo 'Testing...'
        sh 'npm test'
      }
    }
    stage('Deploy') {
      steps {
        sh 'docker build -t dota2analyticsapp-frontend .'
        sh 'docker rm -f dota2analyticsapp-frontend-con || true'
        sh 'docker run -d -p 12000:12000 --restart always --name dota2analyticsapp-frontend-con dota2analyticsapp-frontend'
        sh 'docker image prune -f'
      }
    }
  }
  post {
    always {
      cleanWs()

    }

  }
  options {
    disableConcurrentBuilds()
    timeout(time: 10, unit: 'MINUTES')
  }
}