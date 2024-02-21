pipeline {
  agent any
    environment {
      PROJECT_NAME = "buy01"
        PROJECT_VERSION = ""
    }
  stages {
    stage('Run Tests: User Service') {
      agent {
        label 'main'
      }
      steps {
        dir('user-service') {
          sh 'mvn test'
        }
      }
    }
    stage('Run Tests: Product Service') {
      agent {
        label 'main'
      }
      steps {
        dir('product-service') {
          sh 'mvn test'
        }
      }
    }
    stage('Run Tests: Media Service') {
      agent {
        label 'main'
      }
      steps {
        dir('media-service') {
          sh 'mvn test'
        }
      }
    }
    stage('Run Tests: Order Service') {
      agent {
        label 'main'
      }
      steps {
        dir('order-service') {
          sh 'mvn test'
        }
      }
    }
    stage('Run Tests: Angular') {
      agent {
        label 'main'
      }
      steps {
        dir('angular') {
          sh 'export CHROME_BIN=/usr/bin/google-chrome'
            sh 'npm install'
            sh 'ng test --watch=false --progress=false --browsers ChromeHeadless'
        }
      }
    }
    stage('User Service SonarQube Analysis & Quality Gate') {
      steps {
        script {
          dir('user-service') {
            withCredentials([string(credentialsId: 'sonarqube', variable: 'SONAR_AUTH_TOKEN')]) {
              withSonarQubeEnv('ali droplet') {
                sh 'mvn clean compile'
                  sh """
                  mvn sonar:sonar \
                  -Dsonar.projectKey=buy-01-user-service \
                  -Dsonar.host.url=http://http://137.184.239.175:9000\
                  -Dsonar.token=$SONAR_AUTH_TOKEN
                  """
              }
            }
            timeout(time: 1, unit: 'HOURS') {
              waitForQualityGate abortPipeline: true
            }
          }
        }
      }
    }
    stage('Product Service SonarQube Analysis & Quality Gate') {
      steps {
        script {
          dir('product-service') {
            withCredentials([string(credentialsId: 'sonarqube', variable: 'SONAR_AUTH_TOKEN')]) {
              withSonarQubeEnv('ali droplet') {
                sh 'mvn clean compile'
                  sh """
                  mvn sonar:sonar \
                  -Dsonar.projectKey=buy-01-product-service \
                  -Dsonar.host.url=http://http://137.184.239.175:9000 \
                  -Dsonar.token=$SONAR_AUTH_TOKEN
                  """
              }
            }
            timeout(time: 1, unit: 'HOURS') {
              waitForQualityGate abortPipeline: true
            }
          }
        }
      }
    }
    stage('Media Service SonarQube Analysis & Quality Gate') {
      steps {
        script {
          dir('media-service') {
            withCredentials([string(credentialsId: 'sonarqube', variable: 'SONAR_AUTH_TOKEN')]) {
              withSonarQubeEnv('ali droplet') {
                sh 'mvn clean compile'
                  sh """
                  mvn sonar:sonar \
                  -Dsonar.projectKey=buy-01-media-service \
                  -Dsonar.host.url=http://http://137.184.239.175:9000 \
                  -Dsonar.token=$SONAR_AUTH_TOKEN
                  """
              }
            }
          }
          timeout(time: 1, unit: 'HOURS') {
            waitForQualityGate abortPipeline: true
          }
        }
      }
    }
    stage('Order Service SonarQube Analysis & Quality Gate') {
      steps {
        script {
          dir('order-service') {
            withCredentials([string(credentialsId: 'sonarqube', variable: 'SONAR_AUTH_TOKEN')]) {
              withSonarQubeEnv('ali droplet') {
                sh 'mvn clean compile'
                  sh """
                  mvn sonar:sonar \
                  -Dsonar.projectKey=buy-01-order-service \
                  -Dsonar.host.url=http://6http://137.184.239.175:9000 \
                  -Dsonar.token=$SONAR_AUTH_TOKEN
                  """
              }
            }
          }
          timeout(time: 1, unit: 'HOURS') {
            waitForQualityGate abortPipeline: true
          }
        }
      }
    }
    stage('Angular SonarQube Analysis & Quality Gate') {
      agent {
        label 'master'
      }
      steps {
        dir('angular') {
          sh 'npm install'
            sh 'ng test --watch=false --progress=false --karma-config=karma.conf.js --code-coverage'
            withCredentials([string(credentialsId: 'sonarqube', variable: 'SONAR_AUTH_TOKEN')]) {
              sh """
                sonar-scanner -X \
                -Dsonar.projectKey=buy-01-frontend \
                -Dsonar.host.url=http://137.184.239.175:9000/ \
                -Dsonar.token=$SONAR_AUTH_TOKEN \
                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                -Dsonar.testExecutionReportPaths=reports/test-report.xml
                """
            }
          timeout(time: 1, unit: 'HOURS') {
            waitForQualityGate abortPipeline: true
          }
        }
      }
    }
    stage('Extract Version') {
      steps {
        script {
          PROJECT_VERSION = sh(script: "mvn help:evaluate -Dexpression=project.version -q -DforceStdout | sed -r 's/\\x1B\\[[0-9;]*[JKmsu]//g'", returnStdout: true).trim()
            echo "Project Version: ${PROJECT_VERSION}"
        }
      }
    }

  post {
    success {
      mail to: 'dragana.bjelajac@gritlab.ax',
           subject: "Pipeline ${env.PROJECT_NAME} - Build # ${env.BUILD_NUMBER} - SUCCESS",
           body: "The pipeline was a SUCCESS. Check console output at ${env.BUILD_URL} to view the results."
    }
    failure {
      mail to: 'dragana.bjelajac@gritlab.ax',
           subject: "Pipeline ${env.PROJECT_NAME} - Build # ${env.BUILD_NUMBER} - FAILURE",
           body: "The pipeline was a FAILURE. Check console output at ${env.BUILD_URL} to view the results."
    }
  }
}

