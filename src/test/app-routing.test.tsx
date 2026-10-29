import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import {
  engineeringServices,
  capabilitiesList,
  faqList,
  processTimeline,
  requestStatuses,
} from "@/data/engineeringData";
import {
  generateReferenceNumber,
  generateAccessToken,
  fetchCustomerProjects,
  clearLocalProjects,
} from "@/services/engineeringService";

describe("App routing", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

  it("matches a page for / instead of falling back to not found", () => {
    const matches = router.matchRoutes("/");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches public route /engineering-services", () => {
    const matches = router.matchRoutes("/engineering-services");
    expect(matches.at(-1)?.routeId).toBe("/engineering-services");
  });

  it("matches customer route /my-projects", () => {
    const matches = router.matchRoutes("/my-projects");
    expect(matches.at(-1)?.routeId).toBe("/my-projects");
  });

  it("matches admin route /admin/engineering-requests", () => {
    const matches = router.matchRoutes("/admin/engineering-requests");
    expect(matches.at(-1)?.routeId).toBe("/_authenticated/admin/engineering-requests");
  });
});

describe("Engineering Platform Data & Logic", () => {
  it("provides all 6 core engineering services", () => {
    expect(engineeringServices).toHaveLength(6);
    const slugs = engineeringServices.map((s) => s.slug);
    expect(slugs).toContain("graduation-projects");
    expect(slugs).toContain("hardware-engineering");
    expect(slugs).toContain("software-development");
    expect(slugs).toContain("project-manufacturing");
    expect(slugs).toContain("prototype-development");
    expect(slugs).toContain("technical-consulting");
  });

  it("provides 12 capability categories", () => {
    expect(capabilitiesList).toHaveLength(12);
  });

  it("provides 8 comprehensive FAQs", () => {
    expect(faqList).toHaveLength(8);
    faqList.forEach((faq) => {
      expect(faq.qAr).toBeTruthy();
      expect(faq.qEn).toBeTruthy();
      expect(faq.aAr).toBeTruthy();
      expect(faq.aEn).toBeTruthy();
    });
  });

  it("provides 6 process timeline phases", () => {
    expect(processTimeline).toHaveLength(6);
  });

  it("provides all 9 project request lifecycle statuses", () => {
    expect(requestStatuses).toHaveLength(9);
    const vals = requestStatuses.map((s) => s.value);
    expect(vals).toContain("new");
    expect(vals).toContain("under_review");
    expect(vals).toContain("quotation_sent");
    expect(vals).toContain("in_progress");
    expect(vals).toContain("completed");
  });

  it("generates valid human-readable reference numbers (PRJ-YYYY-XXXX)", () => {
    const ref = generateReferenceNumber();
    expect(ref).toMatch(/^PRJ-\d{4}-\d{4}$/);
  });

  it("generates secure random guest access tokens", () => {
    const token = generateAccessToken();
    expect(token).toHaveLength(32);
  });
});
