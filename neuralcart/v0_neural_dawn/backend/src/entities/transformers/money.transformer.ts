import { ValueTransformer } from 'typeorm';

export const moneyTransformer: ValueTransformer = {
    to(value: number | null | undefined): string | null {
        if (value === null || value === undefined) {
            return null;
        }

        if (typeof value !== 'number') {
            return value as unknown as string;
        }

        return value.toFixed(2);
    },
    from(value: string | null): number | null {
        if (value === null) {
            return null;
        }

        return Number(value);
    }
};

