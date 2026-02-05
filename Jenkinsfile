pipeline {
    agent any

    environment {
        // Define your secrets here (must be added in Jenkins Credentials)
        GCP_PROJECT_ID = 'vision-plus-project'
        GCP_REGION = 'asia-south1'
        DOCKER_IMAGE = "vision-plus-website:${env.BUILD_NUMBER}"
        // Credentials IDs in Jenkins
        GCP_KEY_CRED_ID = 'gcp-sa-key' 
        DATABASE_URL = credentials('DATABASE_URL')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('GCP Auth') {
            steps {
                withCredentials([file(credentialsId: "${GCP_KEY_CRED_ID}", variable: 'GCP_KEY_FILE')]) {
                    sh "gcloud auth activate-service-account --key-file=${GCP_KEY_FILE}"
                    sh "gcloud config set project ${GCP_PROJECT_ID}"
                }
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
                    // Build local image
                    sh "docker build -t ${DOCKER_IMAGE} ."
                    
                    // Tag for Google Artifact Registry or Container Registry
                    // Example for GCR:
                    def gcrImage = "gcr.io/${GCP_PROJECT_ID}/${DOCKER_IMAGE}"
                    sh "docker tag ${DOCKER_IMAGE} ${gcrImage}"
                    
                    // Configure docker for gcloud
                    sh "gcloud auth configure-docker --quiet"
                    sh "docker push ${gcrImage}"
                    
                    env.FINAL_IMAGE = gcrImage
                }
            }
        }

        stage('Deploy to GCP') {
            steps {
                script {
                    sh """
                    gcloud run deploy vision-plus-website \
                        --image ${env.FINAL_IMAGE} \
                        --region ${GCP_REGION} \
                        --platform managed \
                        --allow-unauthenticated \
                        --set-env-vars "DATABASE_URL=${DATABASE_URL},NODE_ENV=production"
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
