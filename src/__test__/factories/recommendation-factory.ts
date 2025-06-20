import { faker } from "@faker-js/faker"
import {
    CloudProvider,
    RecommendationClass,
    type Recommendation,
    type Framework,
    type AffectedResource,
    type ImpactAssessment,
    type URL,
} from "../../types/recommendations"

export class RecommendationFactory {
    static create(overrides: Partial<Recommendation> = {}): Recommendation {
        const frameworks: Framework[] = [
            {
                name: faker.helpers.arrayElement(["CIS AWS", "NIST 800-53", "SOC 2", "ISO 27001"]),
                section: faker.number.int({ min: 1, max: 10 }).toString(),
                subsection: `${faker.number.int({ min: 1, max: 10 })}.${faker.number.int({ min: 1, max: 10 })}`,
            },
            {
                name: faker.helpers.arrayElement(["PCI DSS", "HIPAA", "GDPR"]),
                section: faker.lorem.word().toUpperCase(),
                subsection: `${faker.lorem.word().toUpperCase()}-${faker.number.int({ min: 1, max: 10 })}`,
            },
        ]

        const affectedResources: AffectedResource[] = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
            name: `${faker.word.noun()}-${faker.string.alphanumeric(8)}`,
        }))

        const furtherReading: URL[] = Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
            name: `${faker.company.name()} ${faker.word.noun()} Guide`,
            href: faker.internet.url(),
        }))

        const impactAssessment: ImpactAssessment = {
            totalViolations: faker.number.int({ min: 10, max: 500 }),
            mostImpactedScope: {
                name: `${faker.word.adjective()}-${faker.word.noun()}`,
                type: faker.helpers.arrayElement(["EC2 Instance", "S3 Bucket", "RDS Database", "Lambda Function"]),
                count: faker.number.int({ min: 1, max: 100 }),
            },
        }

        return {
            tenantId: faker.string.uuid(),
            recommendationId: `rec-${faker.string.alphanumeric(8)}`,
            title: faker.lorem.sentence({ min: 3, max: 8 }),
            slug: faker.lorem.slug(),
            description: faker.lorem.paragraph({ min: 2, max: 4 }),
            score: faker.number.int({ min: 0, max: 100 }),
            provider: [faker.helpers.arrayElement(Object.values(CloudProvider).filter((v) => typeof v === "number"))],
            frameworks: frameworks.slice(0, faker.number.int({ min: 1, max: 2 })),
            reasons: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () =>
                faker.lorem.sentence({ min: 2, max: 6 }),
            ),
            furtherReading,
            totalHistoricalViolations: faker.number.int({ min: 50, max: 1000 }),
            affectedResources,
            impactAssessment,
            class: faker.helpers.arrayElement(Object.values(RecommendationClass).filter((v) => typeof v === "number")),
            ...overrides,
        }
    }

    static createMany(count: number, overrides: Partial<Recommendation> = {}): Recommendation[] {
        return Array.from({ length: count }, () => this.create(overrides))
    }

    static createAWS(overrides: Partial<Recommendation> = {}): Recommendation {
        return this.create({
            provider: [CloudProvider.AWS],
            class: RecommendationClass.COMPUTE_RECOMMENDATION,
            frameworks: [
                { name: "CIS AWS", section: "1", subsection: "1.1" },
                { name: "NIST 800-53", section: "AC", subsection: "AC-1" },
            ],
            ...overrides,
        })
    }

    static createAzure(overrides: Partial<Recommendation> = {}): Recommendation {
        return this.create({
            provider: [CloudProvider.AZURE],
            class: RecommendationClass.NETWORKING_RECOMMENDATION,
            frameworks: [{ name: "CIS Azure", section: "2", subsection: "2.1" }],
            ...overrides,
        })
    }

    static createHighScore(overrides: Partial<Recommendation> = {}): Recommendation {
        return this.create({
            score: faker.number.int({ min: 80, max: 100 }),
            totalHistoricalViolations: faker.number.int({ min: 200, max: 1000 }),
            impactAssessment: {
                totalViolations: faker.number.int({ min: 100, max: 500 }),
                mostImpactedScope: {
                    name: `critical-${faker.word.noun()}`,
                    type: "Production Environment",
                    count: faker.number.int({ min: 50, max: 200 }),
                },
            },
            ...overrides,
        })
    }

    static createArchived(overrides: Partial<Recommendation> = {}): Recommendation {
        return this.create({
            title: `[ARCHIVED] ${faker.lorem.sentence({ min: 3, max: 8 })}`,
            ...overrides,
        })
    }
}
