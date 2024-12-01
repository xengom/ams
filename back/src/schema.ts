import { gql } from 'apollo-server';

export const typeDefs = gql`
  type StockPriceDetail {
    currentPrice: Float!
    change: Float!
    changeRate: Float!
    volume: Int!
    openPrice: Float!
    highPrice: Float!
    lowPrice: Float!
    per: Float!
    pbr: Float!
  }

  type StockPrice {
    symbol: String!
    price: StockPriceDetail!
  }

  input StockInput {
    symbol: String!
    excd: String!
  }

  type AccountPortfolio {
    account: Account!
    description: String
    investmentAmount: Float!
    currentValue: Float!
    returnRate: Float!
    stocks: [AccountStock!]!
  }

  type AccountStock {
    id: Int!
    symbol: String!
    name: String!
    quantity: Float!
    currentPrice: Float!
    avgPrice: Float!
    returnPct: Float!
    changeRate: Float!
    assetClass: AssetClass!
    currency: Currency!
  }

  input UpdateStockInput {
    quantity: Float!
    avgPrice: Float!
    assetClass: String!
  }

  type Stock {
    id: Int!
    symbol: String!
    name: String!
    quantity: Float!
    avgPrice: Float!
    currency: String!
    assetClass: String!
    account: String!
    excd: String
    createdAt: String!
    updatedAt: String!
  }

  input CreatePortfolioInput {
    account: Account!
    description: String
  }

  type Portfolio {
    id: Int!
    account: Account!
    description: String
    createdAt: String!
    updatedAt: String!
  }

  enum Currency {
    USD
    KRW
  }

  enum AssetClass {
    US_EQUITY
    KR_EQUITY
    BOND
    CASH
    COMMODITY
  }

  enum Account {
    KW
    MA
    ISA
    KRX
    MA_CMA
    CASH
    IRA
  }

  enum Exchange {
    NYS
    NAS
    AMS
    KRX
  }

  input AddStockInput {
    symbol: String!
    name: String!
    quantity: Float!
    avgPrice: Float!
    currency: Currency!
    assetClass: AssetClass!
    account: Account!
    excd: Exchange
  }

  type Dividend {
    id: Int!
    date: String!
    symbol: String!
    currency: Currency!
    amount: Float!
    amountInKRW: Float
  }

  input AddDividendInput {
    symbol: String!
    currency: Currency!
    amount: Float!
  }

  type DividendSummary {
    year: Int
    totalAmount: Float!
  }

  type Income {
    id: Int!
    date: String!
    type: IncomeType!
    amount: Int!
  }

  type Salary {
    id: Int!
    date: String!
    netAmount: Int!
    grossAmount: Int!
    note: String
  }

  type SalarySummary {
    year: Int!
    totalNetAmount: Int!
    totalGrossAmount: Int!
    investmentRatio: Float!
  }

  enum IncomeType {
    INVESTMENT
    PENSION
    SAVINGS
  }

  input AddIncomeInput {
    date: String!
    type: IncomeType!
    amount: Int!
  }

  input AddSalaryInput {
    date: String!
    netAmount: Int!
    grossAmount: Int!
    note: String
  }

  input UpdateIncomeInput {
    date: String!
    type: IncomeType!
    amount: Int!
  }

  input UpdateSalaryInput {
    date: String!
    netAmount: Int!
    grossAmount: Int!
    note: String
  }

  input RegularPaymentInput {
    detail: String!
    method: String!
    amount: Float!
    paymentDate: Int!
    currency: String!
  }

  input PlanItemInput {
    category: String!
    detail: String!
    amount: Float!
    note: String
  }

  input TransferPlanInput {
    item: String!
    transferDate: Int!
    amount: Float!
    bank: String!
    note: String
  }

  type Query {
    getStockPrice(symbol: String!, excd: String!): StockPriceDetail!
    getStockPrices(stocks: [StockInput!]!): [StockPrice!]!
    getExchangeRate(force: Boolean): Float!
    getAccountPortfolios: [AccountPortfolio!]!
    getDividends(year: Int): [Dividend!]!
    getDividendSummary(year: Int): DividendSummary!
    getIncomes: [Income!]!
    getSalaries(year: Int): [Salary!]!
    getSalarySummary(year: Int): SalarySummary!
    getAssetHistory(startDate: String, endDate: String): [AssetHistory!]!
    getDashboardData: DashboardData!
    getMonthlyPayments: [RegularPayment!]!
    getYearlyPayments: [RegularPayment!]!
    getPlanItems: [PlanItem!]!
    getTransferPlans: [TransferPlan!]!
    getLatestSalary: Float!
  }

  type Mutation {
    updateStock(id: Int!, input: UpdateStockInput!): Stock!
    deleteStock(id: Int!): Stock!
    createPortfolio(input: CreatePortfolioInput!): Portfolio!
    addStock(input: AddStockInput!): Stock!
    deletePortfolio(account: Account!): Portfolio!
    addDividend(input: AddDividendInput!): Dividend!
    deleteDividend(id: Int!): Dividend!
    addIncome(input: AddIncomeInput!): Income!
    updateIncome(id: Int!, input: UpdateIncomeInput!): Income!
    deleteIncome(id: Int!): Income!
    addSalary(input: AddSalaryInput!): Salary!
    updateSalary(id: Int!, input: UpdateSalaryInput!): Salary!
    deleteSalary(id: Int!): Salary!
    refreshExchangeRate: Float!
    addRegularPayment(type: String!, input: RegularPaymentInput!): RegularPayment!
    updateRegularPayment(id: ID!, input: RegularPaymentInput!): RegularPayment!
    deleteRegularPayment(id: ID!): Boolean!
    
    addPlanItem(input: PlanItemInput!): PlanItem!
    updatePlanItem(id: ID!, input: PlanItemInput!): PlanItem!
    deletePlanItem(id: ID!): Boolean!
    
    addTransferPlan(input: TransferPlanInput!): TransferPlan!
    updateTransferPlan(item: String!, input: UpdateTransferPlanInput!): TransferPlan!
  }

  type TreemapData {
    id: String!
    name: String!
    value: Float!
    parent: String
    children: [TreemapData]
  }

  type AssetHistory {
    id: Int!
    date: String!
    investmentAmount: Float!
    currentValue: Float!
    returnRate: Float!
    totalReturn: Float!
    dividendReturn: Float!
    pureReturn: Float!
    value: Float!
  }

  type DashboardData {
    currentValue: Float!
    investmentAmount: Float!
    returnRate: Float!
    totalReturn: Float!
    exchangeRate: Float!
    history: [AssetHistory!]!
    assetClassGroups: [TreemapData!]!
    accountGroups: [TreemapData!]!
  }

  type RegularPayment {
    id: ID!
    detail: String!
    method: String!
    amount: Float!
    paymentDate: Int!
    currency: String!
  }

  type PlanItem {
    id: ID!
    category: String!
    detail: String!
    amount: Float!
    ratio: Float!
    note: String
  }

  type TransferPlan {
    id: ID!
    item: String!
    transferDate: Int!
    amount: Float!
    bank: String!
    note: String
  }

  input UpdateTransferPlanInput {
    transferDate: Int
    bank: String
    note: String
  }
`;