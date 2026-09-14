# nesto Front-End Coding Challenge

It's mortgage season! Your challenge is to build a microsite that empowers clients to get the lowest rate on first try!

## Functional requirements

Design and implement a single page app that allows a user to select a mortgage product, create an application for that product, and update the application with their contact information.

**Screen 1**:
There are two types of mortgages, **Variable** and **Fixed**. The "**best** mortgage product" is the product with the lowest `bestRate` value (see `type Application` below)

- display two lists of one or more of the **best** mortgage products(s), one list for each type of mortgage
- when the user selects a product, create a new application, and then route the user to the next screen

**Screen 2**:
At this point, application has already been created, now the user needs to be able to update the application with their contact information

- display a contact info form where the user can add their first name, last name, email, and phone number
- when the user saves their information, update the application with correct data

**Screen 3**:
The user should have a page available where they can see all the applications that have been created

- display a list of all the applications that have been created
- only display applications that have valid data (i.e. have a first name, last name, email, and phone number)
- when the user selects an application, display the application details with the form to update the application

## Must have

- This test has to be done in React JS.
- Use CSS but don't use component frameworks (e.g.: MATERIAL-UI) or CSS frameworks that abstract away CSS (e.g.: Tailwind). These are great tools but we want to see your CSS skills! Headless UI libraries are ok as long as you're styling the components yourself.
- Provide the best UX/UI possible.
- Use a Visual Indicator to show when the application is saved or updated.
- Responsive design
- Keep your code simple, clean and well-organized
- Don't hesitate to come back to us with any questions along the way. We prefer that you ask questions, rather than assuming or misinterpreting requirements
- Provide a README file with the information about your app (install, run ...)
- Error handling

### Impress us

- Localization: support for multiple languages (English, French, ...)
- Tests (Unit, component ...)
- Use storybook to showcase your components
- Feel free to deploy the microsite to to an host of your choice i.e. [Vercel](https://vercel.com/docs), [Netlify](https://www.netlify.com/with/react/), [Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)

### Remarks

- The wireframes in the `/wireframes` folder are to be used as an inspiration for the design of your app, feel free to use them or not
- You are free to use the assets provided in the `/assets` folder
- You can setup your microsite any way you like

### Things that are important to us

- Code quality, maintainability and readability
- Attention to the User Experience (think: how intuitive is my app?)

### Things you'll not be evaluated on

- Features we didn't list in this README
- The quantity of code you write

# Documentation

## Supporting API

The API is hosted at https://nesto-fe-exam.vercel.app/api. This is the nesto front end exam API.

To interact with it from your code, you'll need to provide the following HTTP headers

| HTTP Header      | Value                         |
| ---------------- | ----------------------------- |
| Accept           | (REQUIRED) application/json   |
| Content-Type     | (REQUIRED) application/json   |
| X-Nesto-Candidat | (REQUIRED) Use your full name |

---

### Get products

Get a list of a mix of Variable and Fixed mortgage products

`GET https://nesto-fe-exam.vercel.app/api/products`

Returns: `Product[]`

### Create Application

Creates a new, incomplete application, and return that application

`POST https://nesto-fe-exam.vercel.app/api/applications`

Body: `type CreateApplication`

Returns: `type Application`

### Get Applications

`GET https://nesto-fe-exam.vercel.app/api/applications`

Returns: `type Application[]`

`GET https://nesto-fe-exam.vercel.app/api/applications/${application.id}`

Returns: `type Application`

### Update Application

Updates the application that matches the ID passed in

`PUT https://nesto-fe-exam.vercel.app/api/applications/${application.id}`

Body: `type Partial<Application>`

Returns: `type Application`

---

### Types

```typescript
export type Product = {
  id: number;
  name: string;
  family: "VALUE_FLEX" | "STANDARD";
  type: "VARIABLE" | "FIXED";
  term:
    | "1_YEAR"
    | "2_YEAR"
    | "3_YEAR"
    | "4_YEAR"
    | "5_YEAR"
    | "6_YEAR"
    | "7_YEAR"
    | "10_YEAR";
  insurable: boolean;
  insurance: "INSURED" | "CONVENTIONAL";
  prepaymentOption: "STANDARD" | "ENHANCED";
  restrictionsOption:
    | "NO_RESTRICTIONS"
    | "SOME_RESTRICTIONS"
    | "MORE_RESTRICTIONS";
  restrictions: string;
  fixedPenaltySpread: string;
  helocOption: "HELOC_WITH" | "HELOC_WITHOUT";
  helocDelta: number;
  lenderName: string;
  lenderType: string;
  rateHold: "30_DAYS" | "45_DAYS" | "60_DAYS" | "90_DAYS" | "120_DAYS";
  rate: number;
  ratePrimeVariance: number;
  bestRate: number;
  created: string;
  updated: string;
};

export type Applicant = {
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type Application = {
  readonly id: string;
  token: string;
  type: "NEW" | "RENEWAL" | "REFINANCE";
  applicants: Applicant[];
  productId?: number;
  readonly createdAt: string;
};

export type CreateApplication = {
  productId: number;
};
```

### Example of API using axios

```typescript
import axios from "axios";

const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "x-nesto-candidat": "Your Full Name Here",
};

export const api = axios.create({
  baseURL: `https://nesto-fe-exam.vercel.app/api`,
  headers: {
    ...DEFAULT_HEADERS,
  },
  timeout: 25000,
});
```
