FROM jenkins/jenkins:lts

USER root

# Install Docker CLI so Jenkins can run Docker commands
RUN apt-get update && \
    apt-get install -y apt-transport-https \
                       ca-certificates \
                       curl \
                       gnupg2 \
                       software-properties-common && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" && \
    apt-get update && \
    apt-get install -y docker-ce-cli && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js (matching your project requirements)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Add jenkins user to docker group (optional, usually handled by mounting the socket)
# RUN groupadd -g 999 docker && usermod -aG docker jenkins

USER jenkins
