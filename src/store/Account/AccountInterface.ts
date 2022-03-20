export const INFO_ACCOUNT_SUMMARY = "INFO_ACCOUNT_SUMMARY";
export const UPDATE_PROMOTIONS = "UPDATE_PROMOTIONS";

export interface AccountSummary {
  promotions: {
    tradingAcademy: number;
    distributorLicense: number;
    both: number;
  };
  academyDaysLeft: number;
  distributorDaysLeft: number;
  directAffiliates: number;
  hasBinaryNetworkBonus: boolean;
  bonusRemainingDays: number;
  configuredWallet: boolean;
  binaryBonusExpiringSide: "right" | "left" | undefined;
  binarySide: "right" | "left" | undefined;
  innerLegUnlocked: boolean | undefined;
  scholarshipPoints: number;
  scholarshipStartDate: Date | undefined;
  scholarshipEndDate: Date | undefined;
}

export interface AccountSummaryState {
  account: AccountSummary;
}
