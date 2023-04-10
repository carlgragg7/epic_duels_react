
class Player:

    def __init__(self, id):
        self.id = id
        self.name = None
        self.location = (30, 30)

    def set_name(self, name):
        self.name = name
        if name.lower() == "luke":
            self.imageURL = "http://localhost:5001/luke"
        else:
            self.imageURL = "http://localhost:5001/vader"

    def set_location(self, location):
        self.location = location

    def get_location(self):
        return self.location

    def __str__(self):
        return f"Player: {self.id} Name: {self.name}"

    # return json of player
    def to_json(self):
        return {'id':self.id,'name':self.name,'location':self.location,'imageURL':self.imageURL}
