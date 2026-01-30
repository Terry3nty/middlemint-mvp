// TypeScript interfaces for Middlemint

export interface Job {
    id: string;
    title: string;
    category: 'Dev' | 'Smart Contract' | 'Writing' | 'Marketing' | 'Design' | 'Audit';
    budget: number;
    description: string;
    requirements: string;
    client_wallet: string;
    status: 'open' | 'in_progress' | 'completed' | 'cancelled';
    created_at: string;
}

export interface Application {
    id: string;
    job_id: string;
    freelancer_wallet: string;
    cover_letter: string;
    requirements_response: string;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
    jobs?: Pick<Job, 'title' | 'budget'>; // For joined queries
}
