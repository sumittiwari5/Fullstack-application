pipeline {

    agent any

    environment {
        DOCKERHUB_CREDS   = credentials(' dockerhub-creds')
        ECR_URI           = '166573185682.dkr.ecr.us-east-1.amazonaws.com'
        DOCKERHUB_USER    = 'sumittiwari05'
        AWS_DEFAULT_REGION = 'us-east-1'
    }

    stages {

        stage('Clone Repo') {
            steps {
                git credentialsId: 'github-token', url: 'YOUR_GITHUB_REPO'
            }
        }

        stage('Generate Version') {
            steps {
                script {
                    env.VERSION = "v${BUILD_NUMBER}"
                    echo "Building version: ${env.VERSION}"
                }
            }
        }

        stage('Build Images') {
            parallel {

                stage('Build Backend') {
                    steps {
                        dir('Backend') {
                            sh "docker build -t clickncart-backend:${VERSION} ."
                        }
                    }
                }

                stage('Build Frontend') {
                    steps {
                        dir('Frontend') {
                            sh "docker build -t clickncart-frontend:${VERSION} ."
                        }
                    }
                }

                stage('Build MySQL') {
                    steps {
                        dir('Database') {
                            sh "docker build -t clickncart-mysql:${VERSION} ."
                        }
                    }
                }
            }
        }

        stage('Push ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region us-east-1 | \
                docker login --username AWS --password-stdin $ECR_URI

                docker tag clickncart-backend:$VERSION  $ECR_URI/clickncart-backend:$VERSION
                docker tag clickncart-frontend:$VERSION $ECR_URI/clickncart-frontend:$VERSION
                docker tag clickncart-mysql:$VERSION    $ECR_URI/clickncart-mysql:$VERSION

                docker push $ECR_URI/clickncart-backend:$VERSION
                docker push $ECR_URI/clickncart-frontend:$VERSION
                docker push $ECR_URI/clickncart-mysql:$VERSION
                '''
            }    
        }

        stage('Push to DockerHub (backup)') {
            steps {
                sh """
                    echo ${DOCKERHUB_CREDS_PSW} | docker login -u ${DOCKERHUB_CREDS_USR} --password-stdin

                    docker tag clickncart-backend:${VERSION}  ${DOCKERHUB_USER}/clickncart-backend:${VERSION}
                    docker tag clickncart-frontend:${VERSION} ${DOCKERHUB_USER}/clickncart-frontend:${VERSION}
                    docker tag clickncart-mysql:${VERSION}    ${DOCKERHUB_USER}/clickncart-mysql:${VERSION}

                    docker push ${DOCKERHUB_USER}/clickncart-backend:${VERSION}
                    docker push ${DOCKERHUB_USER}/clickncart-frontend:${VERSION}
                    docker push ${DOCKERHUB_USER}/clickncart-mysql:${VERSION}
                """
            }
        }

        stage('Cluster Health Check') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    sh """
                        kubectl get nodes
                        kubectl get pods -A
                    """
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    sh """
                        # Apply manifests on first run (idempotent, safe to run always)
                        kubectl apply -f k8s/namespace.yaml
                        kubectl apply -f k8s/secrets/app-secret.yaml
                        kubectl apply -f k8s/mysql/
                        kubectl apply -f k8s/backend/
                        kubectl apply -f k8s/frontend/
                        kubectl apply -f k8s/ingress/

                        # Override image to the versioned ECR image (this is what updates on each build)
                        kubectl set image deployment/backend  backend=\${ECR_URI}/clickncart-backend:\${VERSION}  -n clickncart
                        kubectl set image deployment/frontend frontend=\${ECR_URI}/clickncart-frontend:\${VERSION} -n clickncart
                        kubectl set image deployment/mysql    mysql=\${ECR_URI}/clickncart-mysql:\${VERSION}       -n clickncart
                    """
                }
            }
        }

        stage('Verify Rollout') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    sh """
                        kubectl rollout status deployment/backend  -n clickncart --timeout=120s
                        kubectl rollout status deployment/frontend -n clickncart --timeout=120s
                    """
                }
            }
        }

        stage('Cleanup Local Images') {
            steps {
                sh """
                    docker rmi clickncart-backend:${VERSION}  || true
                    docker rmi clickncart-frontend:${VERSION} || true
                    docker rmi clickncart-mysql:${VERSION}    || true
                """
            }
        }
    }

    post {
        failure {
            withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                sh """
                    kubectl rollout undo deployment/backend  -n clickncart
                    kubectl rollout undo deployment/frontend -n clickncart
                """
            }
        }
        always {
            sh 'docker logout || true'
        }
    }
}
