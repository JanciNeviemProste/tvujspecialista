export const queryKeys = {
  specialists: {
    all: ['specialists'] as const,
    detail: (slug: string) => ['specialist', slug] as const,
  },
  leads: {
    my: ['myLeads'] as const,
  },
  academy: {
    courses: ['courses'] as const,
    course: (slug: string) => ['course', slug] as const,
    enrollments: ['myEnrollments'] as const,
    enrollment: (id: string) => ['enrollment', id] as const,
    enrollmentByCourse: (courseId: string) => ['enrollmentByCourse', courseId] as const,
    enrollmentProgress: (enrollmentId: string) => ['enrollmentProgress', enrollmentId] as const,
    videoUrl: (videoId: string) => ['videoStreamUrl', videoId] as const,
  },
  community: {
    events: ['events'] as const,
    event: (slug: string) => ['event', slug] as const,
    attendees: (eventId: string) => ['attendees', eventId] as const,
    myRSVPs: ['myRSVPs'] as const,
  },
  commissions: {
    all: ['myCommissions'] as const,
    stats: ['commissionStats'] as const,
  },
  subscriptions: {
    current: ['mySubscriptions'] as const,
    active: ['myActiveSubscription'] as const,
  },
  deals: {
    my: ['myDeals'] as const,
    detail: (id: string) => ['deal', id] as const,
    events: (dealId: string) => ['dealEvents', dealId] as const,
    analytics: ['dealAnalytics'] as const,
  },
};
