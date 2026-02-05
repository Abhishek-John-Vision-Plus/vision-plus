pipeline {
    agent any

    environment {
        // Define your secrets here (must be added in Jenkins Credentials)
        GCP_PROJECT_ID = 'vision-plus-project'
        GCP_REGION = 'asia-south1'
        DOCKER_IMAGE = "ghcr.io/${GITHUB_REPOSITORY}:${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Prisma Generate') {
            steps {
                sh 'npx prisma generate'
            }
        }

        stage('Build Next.js') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    // This assumes you have docker installed on the jenkins agent
                    sh "docker build -t ${DOCKER_IMAGE} ."
                    // sh "docker push ${DOCKER_IMAGE}"
                }
            }
        }

        stage('Deploy to GCP') {
            steps {
                script {
                    // Example deployment command using gcloud CLI
                    // Requires gcloud to be installed and authenticated on Jenkins
                    sh """
                    gcloud run deploy vision-plus-website \
                        --image ${DOCKER_IMAGE} \
                        --region ${GCP_REGION} \
                        --platform managed \
                        --allow-unauthenticated
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful! 🎉'
        }
        failure {
            echo 'Deployment failed. 🚨'
        }
    }
}
