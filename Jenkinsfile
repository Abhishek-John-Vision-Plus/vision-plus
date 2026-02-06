pipeline {
    agent any

    environment {
        GCP_PROJECT_ID = 'vision-plus-project'
        GCP_REGION = 'us-central1'
        DOCKER_IMAGE = "vision-plus-website"
        GCP_KEY_CRED_ID = 'gcp-sa-key'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('GCP Auth') {
            steps {
                script {
                    // Try to use the key file first, if it fails, check for GCE Metadata service
                    try {
                        withCredentials([file(credentialsId: "${GCP_KEY_CRED_ID}", variable: 'GCP_KEY_FILE')]) {
                            sh "gcloud auth activate-service-account --key-file=${GCP_KEY_FILE}"
                            sh "gcloud config set project ${GCP_PROJECT_ID}"
                        }
                    } catch (e) {
                        echo "Credential ID '${GCP_KEY_CRED_ID}' not found, attempting to use GCE Default Service Account..."
                        // On a GCP VM, gcloud can automatically use the attached service account
                        sh "gcloud config set project ${GCP_PROJECT_ID}"
                    }
                }
            }
        }

        stage('Install & Build') {
            steps {
                sh 'npm ci'
                sh 'npx prisma generate'
                sh 'npm run build'
            }
        }

        stage('Docker Build & Push') {
            environment {
                FULL_IMAGE_NAME = "gcr.io/${GCP_PROJECT_ID}/${DOCKER_IMAGE}:${env.BUILD_NUMBER}"
            }
            steps {
                script {
                    sh "docker build -t ${FULL_IMAGE_NAME} ."
                    // Ensure docker is authenticated for GCR
                    sh "gcloud auth configure-docker --quiet"
                    sh "docker push ${FULL_IMAGE_NAME}"
                }
            }
        }

        stage('Deploy to GCP') {
            environment {
                FULL_IMAGE_NAME = "gcr.io/${GCP_PROJECT_ID}/${DOCKER_IMAGE}:${env.BUILD_NUMBER}"
                DATABASE_URL = credentials('DATABASE_URL')
            }
            steps {
                // If it's a VM, we might need to specify the account explicitly if multiple exist
                sh """
                gcloud run deploy vision-plus-website \
                    --image ${FULL_IMAGE_NAME} \
                    --region ${GCP_REGION} \
                    --platform managed \
                    --allow-unauthenticated \
                    --set-env-vars "DATABASE_URL=${DATABASE_URL},NODE_ENV=production"
                """
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
