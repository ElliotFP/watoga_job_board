export interface ApplicationDetails {
    applicationId: string;
    title: string;
    location: string;
    jobType: 'Full-Time' | 'Contract';
    salary: string;
    descriptionHeader: string;
    description: string;
    responsibilities: string[];
    competencies: string[];
    inThisRoleYouWill: string[];
    thisMightBeAGoodFitIfYou: string[];
    additionalRequirements: string[];
    note: string | null;
}

export enum SelectBoolean {
    Select = "Select...",
    Yes = "Yes",
    No = "No",
}

export interface ApplicationFields {
    applicationId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    resume: File | null;
    linkedin: string;
    twitter: string;
    github: string;
    willingToRelocate: SelectBoolean;
    willingToWorkIntense: SelectBoolean;
    motivation: string;
    impressiveThing: string;
    additionalInformation: string;
}
