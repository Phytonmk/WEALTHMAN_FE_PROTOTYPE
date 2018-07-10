const defaultState = {
  user: -1,
  login: "",
  password: "",

  currentPage: "",
  currentManager: -1,
  currentInvestor: -1,
  currentAlgorythm: -1,
  currentPortfolio: -1,
  currentRequest: -1,

  currentAccountPage: "personal",
  currentPortfoliosPage: "active",
  currentAlgorythmsPage: "uploaded",

  managersFilter: "Robo-advisor",
  faqId: "",

  showCode: false,
  code: "print(\"hello world\");\n\nfor (int i = 0; i < 10; i++)\n\tprint(\"working...\");\n\nprint(\"Oops!\\nAll your money gone.\");\n\nreturn;",

  currentCurrency: "USD",
  currentCurrencyPrices: [
    {
      name: "USD",
      price: 1
    }, {
      name: "BTC",
      price: 6848.77
    }, {
      name: "ETH",
      price: 415.132
    }, {
      name: "XRP",
      price: 0.491838
    }, {
      name: "BCH",
      price: 651.954
    }, {
      name: "LTC",
      price: 113.974
    },
  ],

  prevousPages: [],

  loggedInvestorLinks: [
    {
      label: "my requests",
      link: "requests"
    }, {
      label: "portfolio",
      link: "portfolios",
    }, {
      label: "managers",
      link: "managers"
    }, {
      label: "account",
      link: "account"
    }, {
      label: "logout",
      link: "logout"
    }
  ],
  loggedManagerLinks: [
    {
      label: "my requests",
      link: "requests"
    }, {
      label: "portfolios",
      link: "portfolios"
    }, {
      label: "account",
      link: "account"
    // }, {
    //   label: "algorythms",
    //   link: "algorythms"
    }, {
      label: "logout",
      link: "logout"
    }
  ],
  loggedSuplierLinks: [
    {
      label: "some page",
      link: "sone"
    }
  ],
  unloggedLinks: [
    {
      label: "about us",
      link: "about"
    }, {
      label: "faq",
      link: "faq"
    }, {
      label: "team",
      link: "team"
    }, {
      label: "contact us",
      link: "contact"
    }, {
      label: "wealthman",
      link: "https://wealthman.io/"
    }, {
      label: "login",
      link: "login"
    }, {
      label: "join",
      link: "register"
    }
  ],//, "login"],//, "invest"],

  investors: [
    {
      type: "investor",
      id: 0,
      name: "Kisa",
      surname: "Vorobyaninov",
      img: "0.jpg",
      age: 36,
      email: "vorobyaninov@mail.ru",
      kyc: false,
      registered: "19.03.2018",
    },
    {
      type: "investor",
      id: 1,
      name: "Jim",
      surname: "Taggart",
      img: "1.jpg",
      age: 31,
      email: "jim@taggart-transcontinental.us",
      kyc: true,
      registered: "20.03.2017",
    },
    {
      type: "investor",
      id: 2,
      name: "John",
      surname: "Bolton",
      img: "2.jpg",
      age: 25,
      email: "bolton@mail.com",
      kyc: true,
      registered: "08.11.2017",
    },
  ],
  managers: [
    {
      type: "manager",
      id: 5,
      name: "Andrey",
      surname: "Morozov",
      age: 28,
      img: "user.svg",
      company: 5,
      money: 97000,
      methodology: "VAR method",
      biography: "KEF HOLDINGS, Business Analyst. DIFC, Dubai, UAE.                                                                       September 2016 – August 2017 • Engaged in financial modeling, transaction due diligence, and investment portfolio performance tracking  • Conducted detailed due diligence on the country, market, competitive environment and financial issues • Conducted regular financial research to stay apprised about global economy and global financial markets • Represented the firm's commercial interests while leading sales, tender contract negotiations, and business development • Worked on projects covering strategy formulation, new project investments, and growth opportunities for KEF Infra GO GOODSCOUT, Executive Insurance Broker. New York, NY, USA.      April 2015 – November 2015 • Managed all aspects of business development from initial strategic and fiscal planning to final testing and delivery • Established strategic business partnerships with over 40 global program senior officials at universities in NYC • Obtained NY Life & Health and Property & Casualty insurance producer licenses INFLOT WORLDWIDE, Supervising Port Agent.  St. Petersburg, Russia.      May 2009 – July 2009 • Coordinated over 100 clearance procedures for international passenger cruise ships calling to the port of SPb • Liaised with port authorities, procured supplies, and arranged customs, immigration and quarantine clearance procedures • Organized documentation filing including submission of crew lists, cargo manifest and trading certificates • Arranged vessel mooring and handling, as well as husbandry services for various types of vessels E",
      social: {
        facebook: "",
        linkedin: ""
      },
      terms: "1,5% of AUM, monthly paid",
      investors: 404,

      rating: 9,
      aum: 13,
      assets: 2,
      profit: 2,
      initial: 2,
      output: 2,
      annual: 2,
      clients: 4,
    },
    {
      type: "manager",
      id: 6,
      name: "Andrei",
      surname: "Huseu",
      age: 28,
      img: "user.svg",
      company: 6,
      money: 97000,
      methodology: "random",
      biography: "--",
      social: {
        facebook: "",
        linkedin: ""
      },
      terms: "1,5% of AUM, monthly paid",
      investors: 404,

      rating: 9,
      aum: 13,
      assets: 2,
      profit: 2,
      initial: 2,
      output: 2,
      annual: 2,
      clients: 4,
    },
    {
      type: "manager",
      id: 7,
      name: "Olga",
      surname: "Pershina",
      age: 28,
      img: "user.svg",
      company: 7,
      money: 97000,
      methodology: "random",
      biography: "--",
      social: {
        facebook: "",
        linkedin: ""
      },
      terms: "1,5% of AUM, monthly paid",
      investors: 404,

      rating: 9,
      aum: 13,
      assets: 2,
      profit: 2,
      initial: 2,
      output: 2,
      annual: 2,
      clients: 4,
    },
  ],

  companies: [
    {
      id: 5,
      name: "Moroz&Co",
      img: "ponzi.png",
      site: "https://en.wikipedia.org/wiki/Ponzi_scheme"
    },
    {
      id: 6,
      name: "Moroz&Co",
      img: "ponzi.png",
      site: "https://en.wikipedia.org/wiki/Ponzi_scheme"
    },
    {
      id: 7,
      name: "Mera Kapital",
      img: "ponzi.png",
      site: "http://www.mera-capital.com/"
    },
  ],

  algorythms: [
    {
      id: 0,
      creator: 0,
      name: "choose one chair",
      rating: 8,
      currency: "BTC"
    },
    {
      id: 1,
      creator: 3,
      name: "NNN",
      rating: 9,
      currency: "DOGE"
    },
    {
      id: 2,
      creator: 2,
      name: "blackjack",
      rating: 10,
      currency: "BTC"
    },
    {
      id: 3,
      creator: 4,
      name: "not_a_ponzi_scheme",
      rating: 6,
      currency: "BTC"
    },
    {
      id: 4,
      creator: 4,
      name: "not_a_pyramid",
      rating: 5,
      currency: "BTC"
    },
    {
      id: 5,
      creator: 2,
      name: "moon",
      rating: 7,
      currency: "ETH"
    },
    {
      id: 6,
      creator: 5,
      name: "podpolniy millionare",
      rating: 9,
      currency: "ETH"
    },
    {
      id: 7,
      creator: 0,
      name: "son of Captian Shmidt",
      rating: 6,
      currency: "ETH"
    },
    {
      id: 8,
      creator: 2,
      name: "planet express",
      rating: 5,
      currency: "ETH"
    },
    {
      id: 9,
      creator: 1,
      name: "bitconnnneeeeeeeeeeeeect",
      rating: 4,
      currency: "ETH"
    },
  ],

  staticQuestions: [
    {
      question: "What is your current age?",
      answers: ["18-24", "25-32", "33-46", "47-54", "55 or older"]
    },
    {
      question: "What of the following best describes your household?",
      answers: ["Single income, no dependents", "Single income, at least one dependent", "Dual income, no dependents", "Dual income, at least one dependent", "Retired or financially independent"]
    },
    {
      question: "What is your primary reason for investing?",
      answers: ["General Savings", "Retirement", "Colledge savings", "Other"]
    },
    {
      question: "What is your annual pre-tax income?",
      answers: ["100-500$", "501-1000$", "1001-5000$", "5001-10000$", "10001-100000$", "100001$ or more"]
    },
    {
      question: "What is the total value of your cash in liquid investments?",
      answers: ["100-500$", "501-1000$", "1001-5000$", "5001-10000$", "10001-100000$", "100001$ or more"]
    },
    {
      question: "What is the total amount of money you want to invest?",
      answers: ["100-500$", "501-1000$", "1001-5000$", "5001-10000$", "10001-100000$", "100001$ or more"]
    },
    {
      question: "When deciding how to invest your money, wich do you care about more?",
      answers: ["Maximizing gains", "Minimizing looses", "Both equally"]
    },
    {
      question: "The global stock market is often volatile. If your entire investement portfolio lost 10% of its value in a month during a market decline, what would you do?",
      answers: ["Sell all of your investments", "Sell some", "Keep all", "Buy more"]
    },
  ],
  dynamicQuestions: [
    {
      question: "What is the term view you invest on?",
      answers: ["less than 1 month", "1 month - 3 months", "3 month 1 day - 6 months", "6 months 1 day - 1 year", "1 year 1 day - 3 years", "3 years and more"],
    },
  ],
  managerQuestions: [
    {
      question: "Are u ready to get rich?",
      answers: ["yes", "definitely", "absolutely!!"]
    },
    {
      question: "Will u invest more soon?",
      answers: ["yes", "definitely", "absolutely!!"]
    },
  ],
  account: {
    personalInfo: {
      firstName: "",
      lastName: "",
      day: 0,
      month: 0,
      year: 0,
      nationality: "",
    }
  },
  portfolios: [
    {
      type: "portfolio",
      id: 0,
      investor: 0,
      manager: 6,
      date: "15:16 01-02-2013",
      value: 1,
      currency: "ETH",
      alg: 0,
      profit: 12,
      cost: 0.2,
      status: "recalculating"
    },
    {
      type: "portfolio",
      id: 1,
      investor: 2,
      manager: 5,
      date: "15:16 01-02-2013",
      value: 7,
      currency: "ETH",
      alg: 1,
      profit: -247,
      cost: 0.4,
      status: "recalculated"
    },
    {
      type: "portfolio",
      id: 2,
      investor: 1,
      manager: 7,
      date: "15:16 01-02-2013",
      value: 6,
      currency: "ETH",
      alg: 2,
      profit: 164,
      cost: 0.67,
      status: "recalculated"
    },
  ],
  requests: [
    {
      type: "request",
      id: 0,
      investor: 0,
      manager: 6,
      date: "15:16 12-11-2017",
      value: 1,
      currency: "ETH",
      status: "cancelled",
    },
    {
      type: "request",
      id: 1,
      investor: 2,
      manager: 7,
      date: "15:16 10-04-2018",
      value: 10,
      currency: "BTC",
      status: "accepted",
    },
    {
      type: "request",
      id: 2,
      investor: 0,
      manager: 6,
      date: "11:16 11-04-2018",
      value: 3,
      currency: "ETH",
      status: "declined",
    },
    {
      type: "request",
      id: 3,
      investor: 1,
      manager: 5,
      date: "19:40 01-02-2016",
      value: 4,
      currency: "ETH",
      status: "pending",
    },
  ],
  agreement: "Wealthfront Inc. is an SEC registered investment advisor.\nBy using this website, you accept our Terms of Use and Privacy Policy. Past performance is no guarantee of future results. Any historical returns, expected returns, or probability projections may not reflect actual future performance. All securities involve risk and may result in loss. Our financial planning services were designed to aid our clients in preparing for their financial futures and allow them to personalize their assumptions for their portfolios. We do not intend to represent that our financial planning guidance is based on or meant to replace a comprehensive evaluation of a client's entire personal portfolio. While the data Wealthfront uses from third parties is believed to be reliable, Wealthfront cannot ensure the accuracy or completeness of data provided by clients or third parties. Wealthfront does not provide tax advice and does not represent in any manner that the outcomes described herein will result in any particular tax consequence. Prospective investors should confer with their personal tax advisors regarding the tax consequences based on their particular circumstances. Wealthfront assumes no responsibility for the tax consequences for any investor of any transaction. Full Disclosure\nThe Wealthfront Risk Parity Fund is managed by WFAS LLC, an SEC registered investment adviser and a wholly owned subsidiary of Wealthfront Inc. WFAS LLC receives an annual management fee equal to 0.50% of the Fund's average daily net assets. Northern Lights Distributors, LLC, a member of FINRA / SIPC, serves as the principal distributor for the Fund.\nBefore investing in the Wealthfront Risk Parity Fund, you should carefully consider the Fund's investment objectives, risks, fees and expenses. This and other information can be found in the Fund's prospectus. Please read the fund prospectus or summary prospectus carefully before investing. In order to add the Wealthfront Risk Parity Fund, we must rebalance your portfolio. As part of this process, if we sell positions at a gain, and you do not have sufficient harvested losses to offset those gains, you'll pay taxes on the net gain.\nAll investing is subject to risk, including the possible loss of the money you invest. In addition, an investment in the Wealthfront Risk Parity Fund (the \"Fund\") would also subject you to the following principal risks, among others: The Fund's principal investment strategy requires the use of derivative instruments, such as investments in total return swaps, forward and futures contracts. In general, a derivative instrument typically involves leverage, providing exposure to potential gain or loss from a change in market price of the underlying security or commodity in a notional amount that exceeds the amount of cash or assets required to establish or maintain the derivative instrument. Adverse changes in the value of the underlying asset or index, can result in a loss to the Fund substantially greater than the amount invested in the derivative itself. These derivative instruments provide the economic effect of financial leverage by creating additional investment exposure to the underlying instrument. Financial leverage will magnify, sometimes significantly, the Fund's exposure to any increase or decrease in prices associated with a particular reference asset resulting in increased volatility in the value of the Fund's portfolio. While such financial leverage has the potential to produce greater gains, it also may result in greater losses, which in some cases may cause the Fund to liquidate other portfolio investments at a loss to comply with limits on leverage and asset segregation requirements imposed by the 1940 Act or to meet redemption requests. If the Fund uses leverage through the purchase of derivative instruments, the Fund has the risk that losses may exceed the net assets of the Fund. The net asset value of the Fund while employing leverage will be more volatile and sensitive to market movements. Investments in total return swap agreements also involves the risk that the party with whom the Fund has entered into the total return swap agreements will default on its obligation to pay the Fund. The Fund's use of derivatives may cause the Fund to realize higher amounts of short-term capital gains than if the Fund had not used such instruments. The Fund may also be subject to overall equity market risk, including volatility, which may affect the value of individual instruments in which the Fund invests. Factors such as domestic and foreign economic growth and market conditions, interest rate levels, and political events affect the securities markets. Markets also tend to move in cycles, with periods of rising and falling prices. If there is a general decline in the securities and other markets, your investment in the Fund may lose value, regardless of the individual results of the securities and other instruments in which the Fund invests. When the value of the Fund's investments goes down, your investment in the Fund decreases in value and you could lose money. As a new fund, there can be no assurance that the Fund will grow to or maintain an economically viable size, in which case it could ultimately liquidate. The Fund is non-diversified under the 1940 Act and may be more susceptible than a diversified fund to being adversely affected by any single corporate, economic, political or regulatory occurrence. For more information regarding the risks of investing in the Fund, please see Principal Investment Risks section of the Fund's prospectus. Past performance is no guarantee of future results.",

  tokens: [
    {
      "name": "Bitcoin",
      "symbol": "BTC",
      "price_usd": "8799.69",
      "price_btc": "1.0",
      "market_cap_usd": "149518718278",
    },
    {
      "name": "Ethereum",
      "symbol": "ETH",
      "price_usd": "605.189",
      "price_btc": "0.0688367",
      "market_cap_usd": "59892115473.0",
    },
    {
      "name": "Ripple",
      "symbol": "XRP",
      "price_usd": "0.858897",
      "price_btc": "0.00009769",
      "market_cap_usd": "33602451230.0",
    },
    {
      "name": "Bitcoin Cash",
      "symbol": "BCH",
      "price_usd": "1135.44",
      "price_btc": "0.129149",
      "market_cap_usd": "19400652981.0",
    },
    {
      "name": "EOS",
      "symbol": "EOS",
      "price_usd": "10.8138",
      "price_btc": "0.00123001",
      "market_cap_usd": "8741671551.0",
    },
    {
      "name": "Litecoin",
      "symbol": "LTC",
      "price_usd": "147.318",
      "price_btc": "0.0167565",
      "market_cap_usd": "8277586684.0",
    },
    {
      "name": "Cardano",
      "symbol": "ADA",
      "price_usd": "0.28347",
      "price_btc": "0.00003224",
      "market_cap_usd": "7349546685.0",
    },
    {
      "name": "Stellar",
      "symbol": "XLM",
      "price_usd": "0.367553",
      "price_btc": "0.00004181",
      "market_cap_usd": "6825325914.0",
    },
    {
      "name": "IOTA",
      "symbol": "MIOTA",
      "price_usd": "1.89329",
      "price_btc": "0.00021535",
      "market_cap_usd": "5262456890.0",
    },
    {
      "name": "NEO",
      "symbol": "NEO",
      "price_usd": "74.1089",
      "price_btc": "0.00842946",
      "market_cap_usd": "4817078500.0",
    }
  ],

  portfolioCurrencies: [
    {
      id: 0,
      type: "currency",
      currency: "BTC",
      percent: 10,
      analysis: "link.com",
      comments: "no comments",
    },
    {
      id: 1,
      type: "currency",
      currency: "ETH",
      percent: 30,
      analysis: "link.com",
      comments: "no comments",
    },
    {
      id: 2,
      type: "currency",
      currency: "XRP",
      percent: 17,
      analysis: "link.com",
      comments: "no comments",
    },
    {
      id: 3,
      type: "currency",
      currency: "BCH",
      percent: 43,
      analysis: "link.com",
      comments: "no comments",
    },
  ],
  coreTeam: [
    {
      name: "Andrei",
      surname: " Huseu",
      position: "CEO",
    },
    {
      name: "Olga",
      surname: "Pershina",
      position: "CFO",
    },
    {
      name: "Maya",
      surname: "Epstein",
      position: "Developer team Lead",
    },
    {
      name: "Dmitriy",
      surname: "Tyagunov",
      position: "Development team Manager",
    },
    {
      name: "Denis",
      surname: "Kus",
      position: "Software engineer manager",
    },
    {
      name: "Anton",
      surname: "Borzenko",
      position: "Blockchain architect Developer",
    },
    {
      name: "Lev",
      surname: "Vasilyev",
      position: "Front-end Developer",
    },
    {
      name: "Alexander",
      surname: "Bayov",
      position: "Head of Strategy",
    },
    {
      name: "Eugene",
      surname: "Matushkin",
      position: "Legal team Lead",
    },
    {
      name: "Ivan",
      surname: "Timshin",
      position: "Senior Lawyer",
    },
    {
      name: "Nikita",
      surname: "Tepikin",
      position: "Lawyer for intellectual property",
    },
    {
      name: "Irina",
      surname: "Voronina",
      position: "Project Manager",
    },
    {
      name: "Elena",
      surname: "Ruzova",
      position: "Junior project Manager",
    },
  ],
  advisory: [
    {
      name: "David",
      surname: "Drake",
      position: "Wealth management & Investment Advisor",
    },
    {
      name: "Alexey",
      surname: "Gusev",
      position: "Expert-mentor on Private banking & IT-security",
    },
    {
      name: "Kate",
      surname: "Korolkevich",
      position: "Lifestyle & IR Advisor",
    },
    {
      name: "Paulius",
      surname: "Stankevicius",
      position: "Global PR Advisor",
    },
    {
      name: "Kirill",
      surname: "Razgulyaev",
      position: "Blockchain and cryptography Advisor",
    },
    {
      name: "Dmitriy",
      surname: "Khan",
      position: "Technical architecture Advisor",
    },
    {
      name: "Nikita",
      surname: "Harchev",
      position: "Strategy Advisor",
    },
    {
      name: "Roman",
      surname: "Lvov",
      position: "Expert-Mentor, Real estate-based assets Advisor",
    },
    {
      name: "Victor",
      surname: "Pivtorak",
      position: "Risk-management Advisor",
    },
    {
      name: "Ivan",
      surname: "Korolev",
      position: "Legal Advisor - Europe & CIS",
    },
    {
      name: "Juliana",
      surname: "Vorono",
      position: "Data Privacy & Agility Advisor",
    },
  ],
};


export default defaultState;