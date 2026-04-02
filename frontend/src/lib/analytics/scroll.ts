import { browser } from '$app/environment';
import { trackScrollDepth } from './posthog';

const milestones = [25, 50, 75, 100];
let trackedMilestones = new Set<number>();
let currentPage = '';

export function initScrollTracking(page: string) {
	if (!browser) return;

	// Reset on new page
	if (page !== currentPage) {
		trackedMilestones = new Set();
		currentPage = page;
	}

	const handler = () => {
		const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
		if (scrollHeight <= 0) return;

		const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

		for (const milestone of milestones) {
			if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
				trackedMilestones.add(milestone);
				trackScrollDepth(milestone, page);
			}
		}
	};

	window.addEventListener('scroll', handler, { passive: true });

	return () => window.removeEventListener('scroll', handler);
}
