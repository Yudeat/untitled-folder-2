
import random
import mysql.connector
import pandas as pd
import time

# player will have
player_range = 100
money = 1000.00
fuel_cost = 2
starting_fuel = 50
r_cost = 500

threshold = 5000
minigame_probability = 0.1

# fixing how much they gain and loos
l_m = 800
hunt_point = 50

# for storing the initial airport
STARTING_AIRPORT_IDENT = ""
game_over = False

conn = mysql.connector.connect(
    host='localhost',
    port=3306,
    database='flight_game',
    user='elsa',
    password='123',
    autocommit=True
)
print("connection established")


def minigame(player_state):
    rewards = ['money_plus', 'fuel_plus', 'money_minus', 'range_minus', 'game_over']
    random.shuffle(rewards)
    a=1
    print("WOW !! You found a loot box!")
    print("Pick one box!")
    print("| Box 1 | Box 2 | Box 3 |")
    reward_index = input("please enter your Box id :").strip()

    reward = rewards[int(reward_index)]

    if reward == 'money_plus':
        player_state['money'] += 100
        print(f"Paljon Onnea :) You won 100 euros !")
        print(f"You have {player_state['money']} euros available.")
    elif reward == 'money_minus':
        player_state['money'] -= 100
        print(f"oh :( You lost 100 euros!")
        print(f"You have now {player_state['money']} euros available.")
    elif reward == 'range_minus':
        player_state['player_range'] -= 1
        print(f"oh :( You lost 1 range!")
        print(f"Your range now is {player_state['player_range']}.")
    elif reward == 'fuel_plus':
        player_state['fuel'] += 10
        print(f"Paljon Onnea :) You won 10 liters fuel!")
        print(f"You have now {player_state['fuel']:.2f} liters available.")
    elif reward == 'game_over':
        print(f"A crash happened and you lost your airplane:(")
        print("Game Over!")
        global game_over
        game_over = True

    return player_state


# function
# get random airport and starting airport

# random airport where player starts
def get_airports(conn):
    sql = """select iso_country, ident, name, latitude_deg, longitude_deg, municipality, continent \
             from airport \
             WHERE continent = 'EU' \
             order by rand() limit 1;"""
    cursor = conn.cursor(dictionary=True)
    cursor.execute(sql)
    result = cursor.fetchone()
    cursor.close()
    return result


# airports closet to current coordinates
def get_near_airports(conn, lon, lat):
    sql = """
          SELECT iso_country, \
                 ident, \
                 name, \
                 latitude_deg, \
                 longitude_deg,
                 ST_Distance_Sphere(POINT(longitude_deg, latitude_deg), POINT(%s, %s)) AS d_m
          FROM airport
          WHERE continent = 'EU'
          ORDER BY d_m ASC LIMIT 11; \
          """
    cursor = conn.cursor(dictionary=True)
    cursor.execute(sql, (lon, lat))
    result = cursor.fetchall()
    cursor.close()
    return result


def get_airport_c(conn, lon, lat):
    sql = """
    SELECT iso_country, ident, name, latitude_deg, longitude_deg from airport
    WHERE continent = 'EU' order by ST_Distance_Sphere(POINT(longitude_deg, latitude_deg), POINT(%s, %s)) asc limit 1;"""
    cursor = conn.cursor(dictionary=True)
    cursor.execute(sql, (lon, lat))
    result = cursor.fetchone()
    cursor.close()
    return result



# Find at max 3 random birds in the range, also calculated gained income and score
def get_birds_in_range(location, range):
    lat = float(location['latitude_deg'])
    long = float(location['longitude_deg'])

    birds = []
    gained_income = 0
    gained_score = 0
    max_birds = random.randint(1, 10)
    sql = f"select name ,rarity, latitude_deg, longitude_deg , ST_Distance_Sphere(POINT(longitude_deg, latitude_deg), POINT(%s, %s)) AS d_m from bird ORDER BY d_m ASC LIMIT %s ;"

    # bird_coords = (coordinates(latitude_deg,longitude_deg))
    cursor = conn.cursor(dictionary=True)
    cursor.execute(sql, (long, lat,max_birds))
    result = cursor.fetchall()
    cursor.close()

    print(f"Birds in range {max_birds} :")
    counter = 0
    for b in result:
        #if len(birds) >= max_birds:
         #   break

        if (float(b['latitude_deg']) - lat) ** 2 + (float(b['latitude_deg']) - long) ** 2 <= range ** 2:
            print(f"({b['name']}):")
            is_successful, s, i = get_score_income(b)
            gained_income += i
            gained_score += s
            if is_successful:
                birds.append(b)
        else:
            counter += 1
    if counter== max_birds:
        print(f"You range is not enough. You can buy equipment to increase it")

    return birds, gained_income, gained_score


# game logics
def start_game(conn):
    player_name = input("please enter you name player :").strip()

    # getting random airport as starting airport
    starting_airport = get_airports(conn)
    starting_longtitude = starting_airport['longitude_deg']
    starting_latitude = starting_airport['latitude_deg']
    starting_ident = starting_airport['ident']

    player_state = {
        'screen_name': player_name,
        'money': money,
        'player_range': player_range,
        'score': 0,
        'location': starting_ident,
        'lon': starting_longtitude,
        'lat': starting_latitude,
        'fuel': starting_fuel,
        'has_radar': False,
        'forced_roll': None,
    }
    print(
        f"your starting ponit is :{starting_airport['name']} in {starting_airport['municipality']} in {starting_airport['continent']}")
    return player_state


# Function to display the equipment menu
def equip_menu(player_state):
    print("Welcome to the Equipment Store!")
    print(f"You have {player_state['money']} euros available.")
    print(f"Your current range is {player_state['player_range']} m and fuel is {player_state['fuel']:.2f}.")
    print("Available Equipment:")

    sql = f"SELECT * FROM equipment;"
    cursor = conn.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    equipment_data = []
    for row in result:
        equipment_data.append([row[0], row[1], row[2], row[3], row[4]])
    df = pd.DataFrame(equipment_data, columns=['ID', 'Name', 'Cost','Range','Fuel'])
    print(df.to_string(index=False))
    equipment_id = input("please enter your equipment id :").strip()
    cursor.close()

    return result, equipment_id


# Function to buy equipment
def buy_equipment(player_state, equipment_id):
    sql = f"SELECT * FROM equipment WHERE id = {equipment_id};"
    cursor = conn.cursor()
    cursor.execute(sql)
    item = cursor.fetchone()
    if item:
        if player_state['money'] >= item[2]:  # Check if player has enough money
            player_state['money'] -= item[2]  # Deduct the cost
            player_state['player_range'] += item[3]  # Increase range
            player_state['fuel'] += item[4]  # Increase fuel
            print(f"You have bought {item[1]} for {item[2]} euros.")
            print(f"Your new range is {player_state['player_range']} m and fuel is {player_state['fuel']:.2f}.")
            return player_state['money'], player_state['player_range'], player_state['fuel']
        else:
            print("You do not have enough money to buy this item.")
    else:
        print("Invalid equipment ID.")
    return player_state['money'], player_state['player_range'], player_state['fuel']


def get_score_income(bird):
    print(f"The {bird['name']} might be here. Let's try to find it")
    hunting_chance = random.randint(1, 10)
    is_successful = hunting_chance >= bird['rarity']
    time.sleep(5)
    if is_successful:
        score = bird['rarity'] * 100
        income = 100
        print(f"Jipii!! You have hunted {bird['name']} successfully.")
    else:
        score = 0
        income = 0
        print(f"Voi ei!! You couldn't find the {bird['name']}.")
    time.sleep(5)

    return is_successful,score, income


# arrival
def arrival(conn, player, airport, birds_hunted, gained_income, gained_score, traveled_distance):
    # Update player's score
    player['score'] += gained_score  # Assuming player has a 'score' key
    player['money'] += gained_income
    player['fuel'] -= round(traveled_distance * fuel_cost, 2)
    # Update player data

    if len(birds_hunted) > 0:
        player['fuel'] -= 5

        # Ensure fuel does not drop below zero
    player['fuel'] = max(player['fuel'], 0)
    # Update player location
    player['location'] = airport['ident']
    player['lon'] = airport['longitude_deg']
    player['lat'] = airport['latitude_deg']
    # Display arrival information
   # print(f"Welcome to {airport['name']} in {airport['iso_country']}!")
    print(f"You have hunted {len(birds_hunted)} birds.")
    if len(birds_hunted) > 0:
        for b in birds_hunted:
            print(f"You have hunted a {b['name']}.")
    print(f"Your new score is: {player['score']}")
    print(f"Remaining fuel: {player['fuel']:.2f} liters")
    print(f"Remaining money: {player['money']} euros")

    player['location'] = airport['ident']

    minigame_trigger = random.random()
    if minigame_trigger < minigame_probability:
        player = minigame(player)

    if player['fuel'] < 5 and player['money'] < 50:
        print(f"You don't have neither enough fuel nor enough money.:(")
        print("Game Over!")
        global game_over
        game_over = True


    return player


# game session

print("Tervetoula! The bird hunting ground starts :")

player_state = start_game(conn)
airport_details = get_airport_c(conn, player_state['lon'], player_state['lat'])
on_airport = airport_details['name']
STARTING_AIRPORT_IDENT = player_state['location']

print(
    f'Dear {player_state['screen_name']} ! You have {player_state['money'] :.2f} euros and your plane range is {player_state['player_range']:.2f} km and current score is {player_state['score']} ! \t LETS GO HUNTING!!!....')

print(f'\n Remember ! Your goal is hunting birds to achieve {threshold} scores to win! ')

# main game loop


action = '0'

while action != 'q' and game_over == False:

    if player_state['score'] >= threshold:
        print("You win!")
        break
    elif player_state['money'] < 10 and player_state['fuel'] < 10:
        print("GAME OVER!")
        game_over = True
        break
    # player will have an option to choose
    print(" What do you want to do? :")
    print("[0] Check my resources")
    print("[1] Buy equipment ")
    print("[2] Select destination to fly")
    print("[Q] Quit the game! ")

    action = input("select an action : ").strip().lower()

    if action == '1':
        chosen_equip, equipment_id = equip_menu(player_state)
        buy_equipment(player_state, equipment_id)
        continue
    elif action == '0':
        print(f"Your score is: {player_state['score']}")
        print(f"Your remaining fuel: {player_state['fuel']:.2f} liters")
        print(f"Your remaining money: {player_state['money']} euros")
        print(f"Your range is : {player_state['player_range']}")
        print(f"Your current location ident is: {player_state['location']} ")
        continue
    elif action == '2':
        near_airport = get_near_airports(conn, player_state['lon'], player_state['lat'])
        print(f"The closest airports are listed.")
        # for airport in near_airport:
        # print(f"Airport: {airport['name']}, Country: {airport['iso_country']}, Distance: {airport['d_m']} meters")
        print(f"select destination to fly between these {len(near_airport) - 1} airports:")
        airport_map = {}
        airport_data = []
        successful = False
        # show list of airports to choose
        for i, airport in enumerate(near_airport):
            distance_m = airport['d_m']
            distance_km = distance_m / 1000.0
            if airport['ident'] == player_state['location'] and distance_m < 100:
                continue
            airport_data.append([i, airport['ident'], airport['name'], distance_km])
            # print(f"[{i:>2}],[{airport['ident']}] {airport['name']:<25} |Dist:{distance_km:.2f}km")
            airport_map[i] = (airport, distance_km)
        df = pd.DataFrame(airport_data, columns=['Index', 'Identifier', 'Name', 'Distance (km)'])
        print(df.to_string(index=False))

        # selecting the destination using ident
        opt = input("Enter the cod of the airport you want to go for hunting :")
        if not opt.isdigit():
            print('Invalid selection. Please enter a number.')
            continue

        opt_index = int(opt)

        if opt_index not in airport_map:
            print('Invalid selection')
            continue

        airport_data, d_km = airport_map[opt_index]
        airport_ident = airport_data['ident']

        if d_km * fuel_cost > player_state['fuel']:
            print('You dont have enough fuel :( please buy fuel or choose closer airport')
            continue
        print(f"Welcome to {airport_data['name']} in {airport_data['iso_country']}!")

        hunted_birds, gained_income, gained_score = get_birds_in_range(airport_data, player_state['player_range'])

        player_state = arrival(conn, player_state, airport_data, hunted_birds, gained_income, gained_score, d_km)
        on_airport = airport_data['name']

        # if player_state['score'] >= threeshold_score:
        #  game_over = True
        #  break

        input("\033[32mPress Enter to continue...\033[0m")
        successful = True

    elif action != 'q':
        print("Invalid action choice ")
        continue

print("Kiitos! Moikka! ")
conn.close()
