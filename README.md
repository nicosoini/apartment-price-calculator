
# Apartment Price Calculator (Asuntohintalaskuri)
This application is part of the Software Development Project course at Laurea University of Applied Sciences. The primary objective of the project is to build a stable and flexible software application capable of adapting to changing requirements. The development process follows an agile methodology, enabling iterative improvements, continuous feedback, and rapid delivery of functional components. The project covers all stages of the Software Development Life Cycle (SDLC), including requirements specification, design, development, testing, deployment, and maintenance.

Our application is an Apartment Price Calculator that offers users a clear and easy way to find out the value of their home.

### Authors

Jiro Pärnänen (ParnanenJ)

Nico Soini (nicosoini)

Miku Honkanen (Miku-laurea)

Saara Orvas (Saara-o)

Martin Smerling (MartinSmerling)

### User Interface

The user interface was designed using Figma tools and implemented with HTML, CSS, and JavaScript. The UI provides a clear landing page that leads to a form where the user fills in the following details:
- Location
- Floor area (square meters)
- Postal code
- Number of rooms
- Price
- Construction year
- Floor
- Additional features (Elevator, Sauna, Balcony)

### The application can be found at: ....

### Application Functionality:
#### Training Data

The training dataset was created using Google Gemini AI because data on sold apartments is not available via a free API.  
The dataset contains a training set of 10,000 rows in total.  
The first row contains the headers.  
Headers:
- hinta (selling price of the apartment in euros (€))
- pinta_ala (in square meters (m²))
- huoneita (number of rooms)
- rakennusvuosi (Year of completion/construction)
- asunnon_tyyppi (1 = Apartment building, 2 = Row house / Terraced house, 3 = Detached house)
- kaupunki (1 = Helsinki, 2 = Espoo, 3 = Tampere, 4 = Turku, 5 = Oulu, 6 = Jyväskylä)
- postinumero (Integer (e.g., 100, 2230, 33100, 90100))
- kerros (Floor number)
- hissi (1 = Yes, 0 = No)
- parveke (1 = Yes, 0 = No)
- sauna (1 = Yes, 0 = No)
- autopaikka (1 = Yes, 0 = No)
- kunto (1 = Poor, 2 = Satisfactory, 3 = Good, 4 = Excellent)
- tontti (1 = Owned, 0 = Rented/Leased)

#### Machine Learning Model

The machine learning model is implemented using the [multivariate linear regression](https://www.npmjs.com/package/ml-regression-multivariate-linear?activeTab=readme) library.  
The model is located in the file [algoritmi.js](https://github.com/nicosoini/Asuntohintalaskuri/blob/main/algoritmi.js). The model is divided into two functions (`opetaMalli()` and `teeEnnuste(OpetettuMLR, arvioitavaTalo)`).  
- `opetaMalli()`: Fetches the training dataset --> parses the training data from CSV format into JavaScript objects --> separates X (apartment features) and Y (target outcomes (price)) from the training dataset --> trains the model --> returns the trained model.
- `teeEnnuste(OpetettuMLR, arvioitavaTalo)`: Takes the trained model (trained with the `opetaMalli()` function) and the user's apartment features as an array as parameters --> makes a price prediction using the trained model and the user's apartment features --> returns the price estimate as an integer.

Both functions are imported and used in the [index.js](https://github.com/nicosoini/Asuntohintalaskuri/blob/main/index.js) file.  

Google Gemini AI was utilized in creating the machine learning model. The AI was used to understand the usage of the library and to adapt it to this specific use case (using X and Y matrices in the apartment price calculator context).

Basic principle of the multivariate linear regression model:

![regression formula](https://github.com/nicosoini/Asuntohintalaskuri/blob/main/kuvat/ML-mallin-laskukaava.png)

- β₀ = intercept / baseline value
- β₁ = variable coefficient (floor area)
- β₂ = variable coefficient (number of rooms)
- β₃ = variable coefficient (construction year)
- ...
- β₁₃ = variable coefficient (plot ownership)

The regression calculates suitable coefficients for the model from the training data. After this, the price prediction is calculated using the formula:  
price = β₀ + β₁X₁ + β₂X₂ + β₃X₃ ... + β₁₃X₁₃

Where:
- X₁ = value of floor area
- X₂ = number of rooms
- X₃ = construction year
- ...
- X₁₃ = plot ownership value
