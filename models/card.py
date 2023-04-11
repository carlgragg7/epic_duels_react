class Card:
    count = 0
    def __init__(self, player_id, name, attack, defense, text, image=None):
        self.player_id = player_id
        self.name = name
        self.attack = attack
        self.defense = defense
        self.text = text
        self.image = image
        self.set_id()


    # Player ID + count to create unique ID
    def set_id(self):
        self.id = f"{self.player_id}{Card.count}"
        Card.count += 1

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "attack": self.attack,
            "defense": self.defense,
            "text": self.text,
            "image": self.image
        }