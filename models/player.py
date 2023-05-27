from models.deck import Deck
from models.card import Card
class Player:

    def __init__(self, id):
        self.id = id
        self.name = None
        self.location = (30, 30)
        self.main_deck = None
        self.hand = Deck(id)
        self.discard_pile = Deck(id)
        self.played_cards = Deck(id)
        self.width = 50
        self.height = 60
        self.imageURL = None
        self.health = 0
        self.max_health = 0

    def create_player(self, import_file=None):
        self.main_deck = Deck(self.id, import_file=import_file)
        with open(import_file, 'r') as f:
            # first line of csv contains the health
            lines = f.readlines()
            split_line = lines[0].split(',')
            self.health = split_line[1]
            self.max_health = split_line[1]

    def set_name(self, name):
        self.name = name
        self.imageURL = f'http://localhost:5001/{name}'

    def set_location(self, location):
        self.location = location

    def get_location(self):
        return self.location

    def __str__(self):
        return f"Player: {self.id} Name: {self.name}"

    # return json of player
    def to_json(self):
        return {
            'id':self.id,
            'name':self.name,
            'location':self.location,
            'imageURL':self.imageURL,
            'width':f'{self.width}px',
            'height':f'{self.height}px',
            'health':self.health,
            'max_health':self.max_health
        }

    def draw_card(self):
        card = self.main_deck.draw_random_card()
        self.hand.add_card(card)

    def discard_card(self, card_id):
        card = self.hand.get_card_by_id(card_id)
        if card == None:
            card = self.played_cards.get_card_by_id(card_id)
        self.hand.remove_card(card)
        self.discard_pile.add_card(card)
        return card

    def play_card(self, card_id):
        card = self.hand.remove_card_by_id(card_id)
        self.played_cards.add_card(card)
        return card

    def get_hand(self):
        return self.hand.get_all_to_json()

    def get_main_deck(self):
        return self.main_deck.get_all_to_json()

    def get_discard_pile(self):
        return self.discard_pile.get_all_to_json()

    def reshuffle_discard_pile(self):
        self.main_deck.replace_cards(self.discard_pile.cards)
        self.discard_pile.cards = []

    # def discard_card(self, card):
    #     self.hand.remove_card(card)
    #     self.discard_pile.add_card(card)

    # def discard_card_from_played(self, card):
    #     self.played_cards.remove_card(card)
    #     self.discard_pile.add_card(card)

    def get_played_cards(self):
        return self.played_cards.get_all_to_json()
