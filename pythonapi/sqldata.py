import json
import random
from datetime import datetime, timedelta

from faker import Faker

from pythonapi.generate import fakerMethod
from re import sub

fake = Faker()

# Helper functions
def get_random_number(width, unsigned=False):
    val = random.randint(0, (1 << 8) ** width - 1)
    return val if unsigned else random.choice([-val, val])

# def get_random_string():
#     words = ['i', 'am', 'fine']
#     return ' '.join(random.choices(words, k=random.randint(1, len(words))))

def get_random_string():
    return fake.name()

def get_random_date():
    current_time = datetime.now()
    d1 = current_time - timedelta(days=1)
    d2 = current_time + timedelta(days=1)
    random_time = current_time + timedelta(seconds=random.randint(int(d1.timestamp()), int(d2.timestamp())))
    return random_time.strftime('%Y-%m-%d')

# def get_random_time():
#     return f'{random.randint(0, 23):02}:{random.randint(0, 59):02}:{random.randint(0, 59):02}'

def get_random_time(max_hours=838, negative=True):
    hours = random.randint((-1 if negative else 0) * max_hours, max_hours)
    minutes = random.randint(0, 59)
    seconds = random.randint(0, 59)
    return f'{str(hours).zfill(2)}:{str(minutes).zfill(2)}:{str(seconds).zfill(2)}'

def get_random_values(arr=[]):
    min_index = random.randint(0, len(arr) - 1)
    max_index = random.randint(min_index, len(arr))
    return arr[min_index:max_index]

def get_random_int_from_interval(min_val, max_val):
    return random.randint(min_val, max_val)

# Iterate through the schema

def generate_mysql_data(schema, no_of):
    final_data = {}

    print("schema", schema)

    schema.sort(key=lambda x: len(x.get('foreignKeys', [])))

    # Sort schema based on dependencies (tables with dependencies come first)
    # schema.sort(key=lambda x: any(dep['name'] == x['name'] for dep in x.get('foreignKeys', [])), reverse=True)

    for table in schema:
        print("table name", table['name'])
        columns = table['columns']
        table_data = {
            'columns': [col['name'] for col in columns],
            'data': []
        }
        final_data[table['name']] = table_data

        old_prime_integers = []
        interval = 100

        foreign_key_columns_map = {}
        if 'foreignKeys' in table:
            for fk in table['foreignKeys']:
                for col in fk['reference']['columns']:
                    col_name = col['column']
                    if col_name not in foreign_key_columns_map:
                        foreign_key_columns_map[col_name] = {'refs': []}
                    foreign_key_columns_map[col_name]['refs'].append(fk['reference'])

        # print("dependencies", table.get('dependencies', []))

        for i in range(0, no_of):
            prime_integers = []
            if 'primaryKey' in table:
                for j, pk_column in enumerate(table['primaryKey']['columns']):
                    if not old_prime_integers:
                        prime_integers.append(j * interval + 1)
                    else:
                        prime_integers.append(old_prime_integers[j] + (table['primaryKey']['columns'].__len__() * interval) + 1 if old_prime_integers[j] % interval == 0 else old_prime_integers[j] + 1)
            old_prime_integers = prime_integers

            prime_columns = [pk['column'] for pk in table['primaryKey']['columns']] if 'primaryKey' in table else []

            value = []
            table_data['data'].append(value)

            for j, col in enumerate(columns):
                col_name = col['name']
                ref, ref_table_data, col_index, random_row = None, None, None, None

                if col_name in foreign_key_columns_map and foreign_key_columns_map[col_name]['refs']:
                    refs = foreign_key_columns_map[col_name]['refs']
                    ref = random.choice(refs)
                    ref_table_data = final_data[ref['table']]
                    col_index = ref_table_data['columns'].index(ref['columns'][0]['column'])
                    if col_index > -1:
                        random_row = random.choice(ref_table_data['data'])

                col_type = col['type']['datatype']

                if random_row:
                    value.append(random_row[col_index])
                elif col_name in prime_columns:
                    value.append(prime_integers[j])
                else:
                    # print('col', col)
                    datatype = col['type']["datatype"]
                    if datatype == 'int':
                        val = fakerMethod(None, "number", sub(r'[^a-zA-Z]', '', col["name"]), col)
                        if not val:
                            width = col['type']['width']
                            unsigned = col['type'].get('unsigned', False)
                            val = get_random_number(width, unsigned)
                        value.append(val)
                    elif datatype == "decimal":
                        value.append(get_random_number(col['type']['digits'], col['type']['decimals']))
                    elif datatype in ['text', 'char', 'varchar']:
                        val = fakerMethod(None, "string", sub(r'[^a-zA-Z]', '', col["name"]), col)
                        if val:
                            value.append(val)
                        else:
                            value.append(get_random_string())
                    elif datatype == 'date':
                        value.append(get_random_date())
                    elif datatype == 'year':
                        digits = col['type']['digits']
                        if digits <= 2:
                            value.append(str(get_random_int_from_interval(0, 99)).zfill(2))
                        else:
                            value.append(str(get_random_int_from_interval(1901, 2155)).zfill(2))
                    elif datatype == 'time':
                        value.append(get_random_time())
                    elif datatype in ['timestamp', 'datetime']:
                        value.append(get_random_date() + " " + get_random_time(23, False))
                    elif datatype == 'set':
                        subset = get_random_values(col['type']['values'])
                        if not subset:
                            subset.append(col['type']['values'][0])
                        value.append(','.join(subset))
                    elif datatype == 'enum':
                        value.append(random.choice(col['type']['values']))
                    else:
                        print('col', col)
                        raise Exception("not implemented")

    return final_data


def get_mysql_data(model):
    data = json.loads(model["data"])
    mysql_date = generate_mysql_data(data, model["records"])
    return {
        "message": "done",
        "data": mysql_date
    }