import random
# import json
from models.card import Card


class Deck:
    def __init__(self, player_id, played_cards=False, import_file=None):
        self.cards = []
        self.player_id = player_id
        if import_file != None:
            self.import_deck(import_file)
        # if not played_cards:
        #     self.add_card(Card(player_id, "Luke", 1, 1, "Luke is a Jedi"))
        #     self.add_card(Card(player_id, "Vader", 1, 2, "Vader is a Sith"))
        #     self.add_card(Card(player_id, "Obi-Wan", 5, 1, "Obi-Wan is a Jedi"))
        #     self.add_card(Card(player_id, "Darth Maul", 1, 4, "Darth Maul is a Sith"))
        #     self.add_card(Card(player_id, "Yoda", 2, 2, "Yoda is a Jedi"))

    # import a deck from a csv file
    def import_deck(self, import_file):
        with open(import_file, 'r') as f:
            # csv has 4 columns: name, attack, defense, description
            count = 0
            for line in f:
                if count < 2:
                    count += 1
                    continue
                line = line.strip()
                line = line.split(",")
                # for i in range(int(line[4])):
                self.add_card(Card(self.player_id, line[0], line[1], line[2], line[3]))

    def add_card(self, card):
        self.cards.append(card)

    def remove_cards(self, cards):
        for card in cards:
            self.remove_card(card)

    def remove_card(self, card):
        new_cards = []
        for c in self.cards:
            if c.id != card.id:
                new_cards.append(c)
        self.cards = new_cards

    def get_all_to_json(self):
        json_cards = []
        for card in self.cards:
            json_cards.append(card.to_json())
        return json_cards

    def get_random_card(self):
        return random.choice(self.cards)

    def draw_random_card(self):
        card = self.get_random_card()
        self.remove_card(card)
        return card

    def replace_cards(self, cards):
        for card in cards:
            self.add_card(card)

    # def shuffle(self):
    #     for i in range(len(self.cards)-1,0,-1):
    #         r = random.randint(0,i)
    #         self.cards[i],self.cards[r] = self.cards[r],self.cards[i]

    def draw_card_by_name(self, name):
        for card in self.cards:
            if card.name == name:
                return card
        return None

    def draw_card_by_id(self, id):
        for card in self.cards:
            if card.id == id:
                return card
        return None

    def remove_card_by_id(self, id):
        card = self.get_card_by_id(id)
        self.remove_card(card)
        return card

    def get_card_by_id(self, id):
        for card in self.cards:
            print(card.id + " : " + id)
            if card.id == id:
                return card
        return None
