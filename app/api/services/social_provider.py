from dataclasses import dataclass


@dataclass
class ProviderConfig:
    name: str
    enabled: bool = True
    env_key: str | None = None


class SocialProvider:
    def __init__(self, config: ProviderConfig):
        self.config = config

    def connect(self):
        return {"status": "ready", "provider": self.config.name}
