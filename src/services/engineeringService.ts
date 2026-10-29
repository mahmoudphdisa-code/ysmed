import { supabase } from "@/integrations/supabase/client";

export interface ProjectSubmissionPayload {
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string | undefined;
  userType: string;
  university?: string | undefined;
  department?: string | undefined;
  projectTitle: string;
  projectCategory: string;
  projectDescription: string;
  objectives?: string | undefined;
  requiredFeatures?: string | undefined;
  currentStage: string;
  existingTechnologies?: string | undefined;
  technicalChallenges?: string | undefined;
  conditionalDetails?: Record<string, any> | undefined;
  services: string[];
  deadline?: string | undefined;
  urgency: string;
  budgetMin?: number | undefined;
  budgetMax?: number | undefined;
  preferredContactMethod?: string | undefined;
  additionalNotes?: string | undefined;
  files?: File[] | undefined;
}

export interface StoredProjectRequest {
  id: string;
  reference_number: string;
  guest_access_token: string;
  customer_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  user_type: string;
  university: string | null;
  department: string | null;
  project_title: string;
  project_category: string;
  project_description: string;
  objectives: string | null;
  required_features: string | null;
  current_stage: string;
  existing_technologies: string | null;
  technical_challenges: string | null;
  conditional_details: any;
  deadline: string | null;
  urgency: string;
  budget_min: number | null;
  budget_max: number | null;
  budget_currency: string | null;
  preferred_contact_method: string | null;
  additional_notes: string | null;
  status: string;
  assigned_admin_id: string | null;
  created_at: string;
  updated_at: string;
  services?: string[];
  files?: Array<{
    id: string;
    file_name: string;
    file_path: string;
    mime_type: string | null;
    file_size: number | null;
    created_at: string;
  }>;
  messages?: Array<{
    id: string;
    sender_name: string;
    sender_role: string;
    message: string;
    is_internal: boolean;
    attachment_url?: string | null;
    attachment_name?: string | null;
    created_at: string;
  }>;
  history?: Array<{
    id: string;
    previous_status: string | null;
    new_status: string;
    notes: string | null;
    created_at: string;
  }>;
  quotes?: Array<{
    id: string;
    quote_number: string;
    scope: string;
    deliverables: string;
    estimated_cost: number;
    currency: string;
    estimated_duration: string;
    terms: string | null;
    quote_status: string;
    created_at: string;
  }>;
  milestones?: Array<{
    id: string;
    title: string;
    description: string | null;
    status: string;
    due_date: string | null;
    completed_at: string | null;
    order_index: number;
  }>;
}

const LOCAL_STORAGE_KEY = "ysmed_engineering_projects";

// Local storage helper for instant sync / fallback
function getLocalProjects(): StoredProjectRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalProjects(projects: StoredProjectRequest[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error("Local storage save error:", err);
  }
}

export function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PRJ-${year}-${rand}`;
}

export function generateAccessToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// 1. Submit Project Request
export async function submitProjectRequest(
  payload: ProjectSubmissionPayload
): Promise<{ success: boolean; referenceNumber: string; accessToken: string; error?: string }> {
  const referenceNumber = generateReferenceNumber();
  const accessToken = generateAccessToken();
  const id = crypto.randomUUID();

  let customerId: string | null = null;
  try {
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user) {
      customerId = authData.user.id;
    }
  } catch {
    // Guest submission
  }

  // Upload files to Supabase Storage if available
  const uploadedFiles: Array<{
    id: string;
    file_name: string;
    file_path: string;
    mime_type: string;
    file_size: number;
    file_category: string;
  }> = [];

  if (payload.files && payload.files.length > 0) {
    for (const file of payload.files) {
      const fileId = crypto.randomUUID();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${referenceNumber}/${fileId}_${safeName}`;

      try {
        const { error: uploadErr } = await supabase.storage
          .from("project-attachments")
          .upload(path, file, { cacheControl: "3600", upsert: true });

        if (!uploadErr) {
          const { data: pubUrl } = supabase.storage
            .from("project-attachments")
            .getPublicUrl(path);

          uploadedFiles.push({
            id: fileId,
            file_name: file.name,
            file_path: pubUrl?.publicUrl || path,
            mime_type: file.type || "application/octet-stream",
            file_size: file.size,
            file_category: "attachment",
          });
        } else {
          // If storage bucket isn't created yet, store metadata for recovery
          uploadedFiles.push({
            id: fileId,
            file_name: file.name,
            file_path: `offline://${file.name}`,
            mime_type: file.type,
            file_size: file.size,
            file_category: "attachment",
          });
        }
      } catch {
        uploadedFiles.push({
          id: fileId,
          file_name: file.name,
          file_path: `local://${file.name}`,
          mime_type: file.type,
          file_size: file.size,
          file_category: "attachment",
        });
      }
    }
  }

  // Prepare full record
  const newProject: StoredProjectRequest = {
    id,
    reference_number: referenceNumber,
    guest_access_token: accessToken,
    customer_id: customerId,
    full_name: payload.fullName.trim(),
    email: payload.email.trim(),
    phone: payload.phone.trim(),
    whatsapp: payload.whatsapp?.trim() || null,
    user_type: payload.userType,
    university: payload.university?.trim() || null,
    department: payload.department?.trim() || null,
    project_title: payload.projectTitle.trim(),
    project_category: payload.projectCategory,
    project_description: payload.projectDescription.trim(),
    objectives: payload.objectives?.trim() || null,
    required_features: payload.requiredFeatures?.trim() || null,
    current_stage: payload.currentStage,
    existing_technologies: payload.existingTechnologies?.trim() || null,
    technical_challenges: payload.technicalChallenges?.trim() || null,
    conditional_details: payload.conditionalDetails || {},
    deadline: payload.deadline || null,
    urgency: payload.urgency || "normal",
    budget_min: payload.budgetMin || null,
    budget_max: payload.budgetMax || null,
    budget_currency: "EGP",
    preferred_contact_method: payload.preferredContactMethod || "whatsapp",
    additional_notes: payload.additionalNotes?.trim() || null,
    status: "new",
    assigned_admin_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    services: payload.services,
    files: uploadedFiles.map((f) => ({
      id: f.id,
      file_name: f.file_name,
      file_path: f.file_path,
      mime_type: f.mime_type,
      file_size: f.file_size,
      created_at: new Date().toISOString(),
    })),
    messages: [
      {
        id: crypto.randomUUID(),
        sender_name: "YSMED Engineering Team",
        sender_role: "admin",
        message:
          "أهلاً بك! تم استلام طلب مشروعك بنجاح. يقوم مهندسونا بمراجعة المتطلبات الفنية والمرفقات، وسنوافيك بالتقييم الفني وعرض السعر خلال 24 ساعة.",
        is_internal: false,
        created_at: new Date().toISOString(),
      },
    ],
    history: [
      {
        id: crypto.randomUUID(),
        previous_status: null,
        new_status: "new",
        notes: "تم إرسال الطلب بنجاح في النظام",
        created_at: new Date().toISOString(),
      },
    ],
    quotes: [],
    milestones: [
      {
        id: crypto.randomUUID(),
        title: "المراجعة الفنية ودراسة الجدوى",
        description: "مراجعة المخططات والمتطلبات وتحديد المكونات الهندسية",
        status: "in_progress",
        due_date: null,
        completed_at: null,
        order_index: 1,
      },
      {
        id: crypto.randomUUID(),
        title: "إعداد الخطة الهندسية وعرض السعر",
        description: "تحديد نطاق العمل والمخرجات والميزانية المتوقعة",
        status: "pending",
        due_date: null,
        completed_at: null,
        order_index: 2,
      },
      {
        id: crypto.randomUUID(),
        title: "التطوير والبرمجة والتصنيع",
        description: "تنفيذ دوائر الهاردوير وتطوير السوفتوير والتجميع",
        status: "pending",
        due_date: null,
        completed_at: null,
        order_index: 3,
      },
      {
        id: crypto.randomUUID(),
        title: "الفحص التشغيلي وضمان الجودة والتسليم",
        description: "اختبارات الجهد والأداء وتسليم المشروع مع وثائق التشغيل",
        status: "pending",
        due_date: null,
        completed_at: null,
        order_index: 4,
      },
    ],
  };

  // Try persisting to Supabase PostgreSQL
  try {
    const { error: insertErr } = await supabase.from("project_requests" as any).insert({
      id: newProject.id,
      reference_number: newProject.reference_number,
      guest_access_token: newProject.guest_access_token,
      customer_id: newProject.customer_id,
      full_name: newProject.full_name,
      email: newProject.email,
      phone: newProject.phone,
      whatsapp: newProject.whatsapp,
      user_type: newProject.user_type,
      university: newProject.university,
      department: newProject.department,
      project_title: newProject.project_title,
      project_category: newProject.project_category,
      project_description: newProject.project_description,
      objectives: newProject.objectives,
      required_features: newProject.required_features,
      current_stage: newProject.current_stage,
      existing_technologies: newProject.existing_technologies,
      technical_challenges: newProject.technical_challenges,
      conditional_details: newProject.conditional_details,
      deadline: newProject.deadline,
      urgency: newProject.urgency,
      budget_min: newProject.budget_min,
      budget_max: newProject.budget_max,
      budget_currency: newProject.budget_currency,
      preferred_contact_method: newProject.preferred_contact_method,
      additional_notes: newProject.additional_notes,
      status: "new",
    });

    if (!insertErr) {
      // Insert services links
      if (payload.services && payload.services.length > 0) {
        const serviceLinks = payload.services.map((s) => ({
          project_request_id: newProject.id,
          service_slug: s,
        }));
        await supabase.from("project_request_services" as any).insert(serviceLinks);
      }

      // Insert files
      if (uploadedFiles.length > 0) {
        const fileRecords = uploadedFiles.map((f) => ({
          project_request_id: newProject.id,
          file_name: f.file_name,
          file_path: f.file_path,
          mime_type: f.mime_type,
          file_size: f.file_size,
          file_category: f.file_category,
        }));
        await supabase.from("project_files" as any).insert(fileRecords);
      }

      // Insert initial welcome message
      await supabase.from("project_messages" as any).insert({
        project_request_id: newProject.id,
        sender_name: "YSMED Engineering Team",
        sender_role: "admin",
        message:
          "أهلاً بك! تم استلام طلب مشروعك بنجاح. يقوم مهندسونا بمراجعة المتطلبات الفنية والمرفقات، وسنوافيك بالتقييم الفني وعرض السعر خلال 24 ساعة.",
        is_internal: false,
      });

      // Insert notification for admin
      await supabase.from("admin_notifications" as any).insert({
        project_request_id: newProject.id,
        notification_type: "new_request",
        title: `طلب مشروع جديد: ${newProject.project_title}`,
        content: `من ${newProject.full_name} (${newProject.phone}) - رقم المرجع: ${newProject.reference_number}`,
      });
    }
  } catch (err) {
    console.warn("Supabase project_requests insert warning (local sync active):", err);
  }

  // Always save in localStorage for instant tracking
  const locals = getLocalProjects();
  locals.unshift(newProject);
  saveLocalProjects(locals);

  return {
    success: true,
    referenceNumber,
    accessToken,
  };
}

// 2. Fetch Project by Reference Number and Access Token (or authenticated user)
export async function fetchProjectDetails(
  referenceNumber: string,
  accessToken?: string
): Promise<StoredProjectRequest | null> {
  const cleanRef = referenceNumber.trim();
  const cleanToken = accessToken?.trim();

  // 1. Try Supabase RPC first
  if (cleanToken) {
    try {
      const { data, error } = await supabase.rpc("verify_guest_project" as any, {
        p_reference: cleanRef,
        p_token: cleanToken,
      });

      if (!error && data && (data as any).project) {
        const d = data as any;
        return {
          ...d.project,
          services: (d.services || []).map((s: any) => s.service_slug),
          files: d.files || [],
          messages: d.messages || [],
          history: d.history || [],
          quotes: d.quotes || [],
          milestones: d.milestones || [],
        };
      }
    } catch {
      // fallback
    }
  }

  // 2. Try direct select from Supabase
  try {
    let q = supabase
      .from("project_requests" as any)
      .select("*")
      .eq("reference_number", cleanRef);

    if (cleanToken) {
      q = q.eq("guest_access_token", cleanToken);
    }

    const { data: projectRow, error: pErr } = await q.maybeSingle();

    if (!pErr && projectRow) {
      const pr = projectRow as any;
      const [
        { data: sData },
        { data: fData },
        { data: mData },
        { data: hData },
        { data: qData },
        { data: mlData },
      ] = await Promise.all([
        supabase
          .from("project_request_services" as any)
          .select("service_slug")
          .eq("project_request_id", pr.id),
        supabase
          .from("project_files" as any)
          .select("id, file_name, file_path, mime_type, file_size, created_at")
          .eq("project_request_id", pr.id),
        supabase
          .from("project_messages" as any)
          .select("id, sender_name, sender_role, message, is_internal, attachment_url, attachment_name, created_at")
          .eq("project_request_id", pr.id)
          .eq("is_internal", false)
          .order("created_at", { ascending: true }),
        supabase
          .from("project_status_history" as any)
          .select("id, previous_status, new_status, notes, created_at")
          .eq("project_request_id", pr.id)
          .order("created_at", { ascending: true }),
        supabase
          .from("project_quotes" as any)
          .select("id, quote_number, scope, deliverables, estimated_cost, currency, estimated_duration, terms, quote_status, created_at")
          .eq("project_request_id", pr.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("project_milestones" as any)
          .select("id, title, description, status, due_date, completed_at, order_index")
          .eq("project_request_id", pr.id)
          .order("order_index", { ascending: true }),
      ]);

      return {
        ...pr,
        services: (sData || []).map((x: any) => x.service_slug),
        files: fData || [],
        messages: mData || [],
        history: hData || [],
        quotes: qData || [],
        milestones: mlData || [],
      };
    }
  } catch (err) {
    console.warn("Direct select error:", err);
  }

  // 3. Fallback to localStorage
  const locals = getLocalProjects();
  const matched = locals.find((p) => {
    if (p.reference_number.toUpperCase() !== cleanRef.toUpperCase()) return false;
    if (cleanToken && p.guest_access_token !== cleanToken) return false;
    return true;
  });

  return matched || null;
}

// 3. Fetch all projects for the currently logged-in user
export async function fetchCustomerProjects(userId?: string): Promise<StoredProjectRequest[]> {
  const result: StoredProjectRequest[] = [];

  if (userId) {
    try {
      const { data, error } = await supabase
        .from("project_requests" as any)
        .select("*")
        .eq("customer_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        for (const row of data as any[]) {
          result.push({
            ...row,
            services: [],
            files: [],
            messages: [],
            history: [],
            quotes: [],
            milestones: [],
          });
        }
      }
    } catch {
      // fallback
    }
  }

  // Merge with any projects in localStorage
  const locals = getLocalProjects();
  for (const lp of locals) {
    if (!result.some((r) => r.reference_number === lp.reference_number)) {
      if (!userId || lp.customer_id === userId || !lp.customer_id) {
        result.push(lp);
      }
    }
  }

  return result;
}

// 4. Send Message from Customer
export async function sendCustomerMessage(
  projectId: string,
  referenceNumber: string,
  accessToken: string,
  senderName: string,
  message: string,
  attachment?: { url: string; name: string }
): Promise<boolean> {
  const trimmed = message.trim();
  if (!trimmed) return false;

  // 1. Try RPC
  try {
    const { error } = await supabase.rpc("guest_send_message" as any, {
      p_reference: referenceNumber,
      p_token: accessToken,
      p_sender_name: senderName || "Customer",
      p_message: trimmed,
      p_attachment_url: attachment?.url || null,
      p_attachment_name: attachment?.name || null,
    });

    if (!error) {
      updateLocalMessage(referenceNumber, {
        id: crypto.randomUUID(),
        sender_name: senderName || "Customer",
        sender_role: "customer",
        message: trimmed,
        is_internal: false,
        attachment_url: attachment?.url,
        attachment_name: attachment?.name,
        created_at: new Date().toISOString(),
      });
      return true;
    }
  } catch {
    // fallback
  }

  // 2. Direct insert
  try {
    const { error: insErr } = await supabase.from("project_messages" as any).insert({
      project_request_id: projectId,
      sender_name: senderName || "Customer",
      sender_role: "customer",
      message: trimmed,
      is_internal: false,
      attachment_url: attachment?.url || null,
      attachment_name: attachment?.name || null,
    });

    if (!insErr) {
      updateLocalMessage(referenceNumber, {
        id: crypto.randomUUID(),
        sender_name: senderName || "Customer",
        sender_role: "customer",
        message: trimmed,
        is_internal: false,
        attachment_url: attachment?.url,
        attachment_name: attachment?.name,
        created_at: new Date().toISOString(),
      });
      return true;
    }
  } catch {
    // fallback to local
  }

  // 3. Fallback local save
  updateLocalMessage(referenceNumber, {
    id: crypto.randomUUID(),
    sender_name: senderName || "Customer",
    sender_role: "customer",
    message: trimmed,
    is_internal: false,
    attachment_url: attachment?.url,
    attachment_name: attachment?.name,
    created_at: new Date().toISOString(),
  });
  return true;
}

function updateLocalMessage(reference: string, msg: any) {
  const list = getLocalProjects();
  const target = list.find((p) => p.reference_number === reference);
  if (target) {
    if (!target.messages) target.messages = [];
    target.messages.push(msg);
    saveLocalProjects(list);
  }
}

// 5. Customer Quotation Decision
export async function respondToQuotation(
  quoteId: string,
  projectId: string,
  referenceNumber: string,
  decision: "approved" | "declined"
): Promise<boolean> {
  try {
    await supabase
      .from("project_quotes" as any)
      .update({ quote_status: decision })
      .eq("id", quoteId);

    if (decision === "approved") {
      await supabase
        .from("project_requests" as any)
        .update({ status: "in_progress" })
        .eq("id", projectId);
    }
  } catch {
    // local sync
  }

  const list = getLocalProjects();
  const target = list.find((p) => p.reference_number === referenceNumber);
  if (target) {
    const qIdx = target.quotes?.findIndex((q) => q.id === quoteId);
    if (qIdx !== undefined && qIdx !== -1 && target.quotes && target.quotes[qIdx]) {
      target.quotes[qIdx].quote_status = decision;
    }
    if (decision === "approved") {
      target.status = "in_progress";
      if (!target.history) target.history = [];
      target.history.push({
        id: crypto.randomUUID(),
        previous_status: "quotation_sent",
        new_status: "in_progress",
        notes: "تمت الموافقة على عرض السعر والبدء بالتنفيذ",
        created_at: new Date().toISOString(),
      });
    }
    saveLocalProjects(list);
  }

  return true;
}

// ==========================================
// ADMIN DASHBOARD OPERATIONS
// ==========================================

export async function fetchAllAdminRequests(): Promise<StoredProjectRequest[]> {
  try {
    const { data, error } = await supabase
      .from("project_requests" as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      const formatted: StoredProjectRequest[] = [];
      for (const row of data as any[]) {
        const [
          { data: sData },
          { data: fData },
          { data: mData },
          { data: hData },
          { data: qData },
          { data: mlData },
        ] = await Promise.all([
          supabase
            .from("project_request_services" as any)
            .select("service_slug")
            .eq("project_request_id", row.id),
          supabase
            .from("project_files" as any)
            .select("id, file_name, file_path, mime_type, file_size, created_at")
            .eq("project_request_id", row.id),
          supabase
            .from("project_messages" as any)
            .select("id, sender_name, sender_role, message, is_internal, attachment_url, attachment_name, created_at")
            .eq("project_request_id", row.id)
            .order("created_at", { ascending: true }),
          supabase
            .from("project_status_history" as any)
            .select("id, previous_status, new_status, notes, created_at")
            .eq("project_request_id", row.id)
            .order("created_at", { ascending: true }),
          supabase
            .from("project_quotes" as any)
            .select("id, quote_number, scope, deliverables, estimated_cost, currency, estimated_duration, terms, quote_status, created_at")
            .eq("project_request_id", row.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("project_milestones" as any)
            .select("id, title, description, status, due_date, completed_at, order_index")
            .eq("project_request_id", row.id)
            .order("order_index", { ascending: true }),
        ]);

        formatted.push({
          ...row,
          services: (sData || []).map((x: any) => x.service_slug),
          files: fData || [],
          messages: mData || [],
          history: hData || [],
          quotes: qData || [],
          milestones: mlData || [],
        });
      }
      return formatted;
    }
  } catch (err) {
    console.warn("fetchAllAdminRequests from DB error:", err);
  }

  // Fallback to local storage
  return getLocalProjects();
}

export async function adminUpdateRequestStatus(
  projectId: string,
  newStatus: string,
  notes?: string
): Promise<boolean> {
  try {
    await supabase
      .from("project_requests" as any)
      .update({ status: newStatus })
      .eq("id", projectId);

    await supabase.from("project_status_history" as any).insert({
      project_request_id: projectId,
      new_status: newStatus,
      notes: notes || "تحديث حالة الطلب بواسطة المشرف",
    });
  } catch {
    // local sync
  }

  const list = getLocalProjects();
  const item = list.find((p) => p.id === projectId);
  if (item) {
    const prev = item.status;
    item.status = newStatus;
    if (!item.history) item.history = [];
    item.history.push({
      id: crypto.randomUUID(),
      previous_status: prev,
      new_status: newStatus,
      notes: notes || "تحديث بواسطة المشرف",
      created_at: new Date().toISOString(),
    });
    saveLocalProjects(list);
  }

  return true;
}

export async function adminSendProjectMessage(
  projectId: string,
  message: string,
  isInternal: boolean = false,
  attachment?: { url: string; name: string }
): Promise<boolean> {
  const trimmed = message.trim();
  if (!trimmed) return false;

  try {
    await supabase.from("project_messages" as any).insert({
      project_request_id: projectId,
      sender_name: isInternal ? "الملاحظات الداخلية (Internal)" : "مهندس الدعم الفني - YSMED",
      sender_role: "admin",
      message: trimmed,
      is_internal: isInternal,
      attachment_url: attachment?.url || null,
      attachment_name: attachment?.name || null,
    });
  } catch {
    // local sync
  }

  const list = getLocalProjects();
  const item = list.find((p) => p.id === projectId);
  if (item) {
    if (!item.messages) item.messages = [];
    item.messages.push({
      id: crypto.randomUUID(),
      sender_name: isInternal ? "ملاحظة داخلية" : "فريق YSMED الهندسي",
      sender_role: "admin",
      message: trimmed,
      is_internal: isInternal,
      attachment_url: attachment?.url || null,
      attachment_name: attachment?.name || null,
      created_at: new Date().toISOString(),
    });
    saveLocalProjects(list);
  }

  return true;
}

export async function adminCreateQuotation(
  projectId: string,
  scope: string,
  deliverables: string,
  cost: number,
  currency: string = "EGP",
  duration: string,
  terms?: string
): Promise<boolean> {
  const quoteNumber = `QTE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

  try {
    await supabase.from("project_quotes" as any).insert({
      project_request_id: projectId,
      quote_number: quoteNumber,
      scope,
      deliverables,
      estimated_cost: cost,
      currency,
      estimated_duration: duration,
      terms,
      quote_status: "sent",
    });

    await adminUpdateRequestStatus(projectId, "quotation_sent", `تم إصدار عرض السعر ${quoteNumber}`);
  } catch {
    // local sync
  }

  const list = getLocalProjects();
  const item = list.find((p) => p.id === projectId);
  if (item) {
    if (!item.quotes) item.quotes = [];
    item.quotes.unshift({
      id: crypto.randomUUID(),
      quote_number: quoteNumber,
      scope,
      deliverables,
      estimated_cost: cost,
      currency,
      estimated_duration: duration,
      terms: terms || null,
      quote_status: "sent",
      created_at: new Date().toISOString(),
    });
    item.status = "quotation_sent";
    saveLocalProjects(list);
  }

  return true;
}

export async function adminAddMilestone(
  projectId: string,
  title: string,
  description?: string,
  dueDate?: string
): Promise<boolean> {
  try {
    await supabase.from("project_milestones" as any).insert({
      project_request_id: projectId,
      title,
      description,
      status: "pending",
      due_date: dueDate || null,
    });
  } catch {
    // local sync
  }

  const list = getLocalProjects();
  const item = list.find((p) => p.id === projectId);
  if (item) {
    if (!item.milestones) item.milestones = [];
    item.milestones.push({
      id: crypto.randomUUID(),
      title,
      description: description || null,
      status: "pending",
      due_date: dueDate || null,
      completed_at: null,
      order_index: item.milestones.length + 1,
    });
    saveLocalProjects(list);
  }

  return true;
}

export async function adminToggleMilestoneStatus(
  milestoneId: string,
  newStatus: "pending" | "in_progress" | "completed"
): Promise<boolean> {
  try {
    await supabase
      .from("project_milestones" as any)
      .update({
        status: newStatus,
        completed_at: newStatus === "completed" ? new Date().toISOString() : null,
      })
      .eq("id", milestoneId);
  } catch {
    // local sync
  }

  const list = getLocalProjects();
  for (const item of list) {
    const ml = item.milestones?.find((m) => m.id === milestoneId);
    if (ml) {
      ml.status = newStatus;
      ml.completed_at = newStatus === "completed" ? new Date().toISOString() : null;
      saveLocalProjects(list);
      break;
    }
  }

  return true;
}
