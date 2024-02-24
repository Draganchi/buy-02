pipeline {
  agent any
  tools {
    maven "Maven 3.9.6"
    jdk 'JDK17'
  }
  environment {
    PROJECT_NAME = "buy01"
    PROJECT_VERSION = ""
  }
  stages {
    stage('Run Tests: User Service') {
      agent { label 'master' }
      steps {
        dir('user-service') {
          sh 'mvn test'
        }
      }
    }
    stage('Run Tests: Product Service') {
      agent { label 'master' }
      steps {
        dir('product-service') {
          sh 'mvn test'
        }
      }
    }
    stage('Run Tests: Media Service') {
      agent { label 'master' }
      steps {
        dir('media-service') {
          sh 'mvn test'
        }
      }
    }
    stage('Run Tests: Order Service') {
      agent { label 'master' }
      steps {
        dir('order-service') {
          sh 'mvn test'
        }
      }
    }
    stage('Run Tests: Angular') {
      agent { label 'master' }
      steps {
        dir('angular') {
          sh 'export CHROME_BIN=/usr/bin/google-chrome'
          sh 'npm install'
          sh 'ng test --watch=false --progress=false --browsers ChromeHeadless'
        }
      }
    }
    stage('SonarQube Analysis') {
      steps {
        script {
          withSonarQubeEnv('buy-01'){
                sh '''
                mvn sonar:sonar \
                -Dsonar.projectKey=buy-01-user-service \
                -Dsonar.host.url=http://146.190.63.24:9000 \
                -Dsonar.token=squ_a45b7b014af2b8b9b1a6cdbf4b88eb8e0db59b82
               '''
              }
            }
            timeout(time: 1, unit: 'HOURS') {
              waitForQualityGate abortPipeline: true
            }
          }
        }
      }
    }
   
    // Ensure similar corrections for other stages...
    stage('Extract Version') {
      steps {
        script {
          PROJECT_VERSION = sh(script: "mvn help:evaluate -Dexpression=project.version -q -DforceStdout", returnStdout: true).trim()
          echo "Project Version: ${PROJECT_VERSION}"
        }
      }
    }
  }
  post {
    success {
       mail to: 'dragana.jenkins.2024@gmail.com',
           subject: "Pipeline ${env.PROJECT_NAME} - Build # ${env.BUILD_NUMBER} - SUCCESS",
           body: "The pipeline was a SUCCESS. Check console output at ${env.BUILD_URL} to view the results."
    }
    failure {
      mail to: 'dragana.jenkins.2024@gmail.com',
           subject: "Pipeline ${env.PROJECT_NAME} - Build # ${env.BUILD_NUMBER} - FAILURE",
           body: "The pipeline was a FAILURE. Check console output at ${env.BUILD_URL} to view the results."
    }
  }
}
