class BotManager:
    def __init__(self):
        self.providers = []

    def register_provider(self, provider):
        self.providers.append(provider)

    def list_providers(self):
        return [provider.config.name for provider in self.providers]
