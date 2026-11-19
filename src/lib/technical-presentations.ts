export type TechnicalPresentation = {
  title: string;
  description: string;
  imageKey: string | null;
};

export type ArchivedPresentations = {
  id: string;
  offerNumber: string;
  clientName: string;
  presentations: TechnicalPresentation[];
};
