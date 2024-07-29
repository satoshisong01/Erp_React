const URL = {
    //COMMON
    MAIN: "/", //메인페이지

    Tabs: "/tabs", //탭
    ExecutionTabPage: "/exeTab",
    ReferenceTabPage: "/refTab",
    SalesTabPage: "/salTab",
    SystemTabPage: "/sysTab",

    LOGIN: "/login", //로그인
    MyInfo: "/MyInfo",
    ERROR: "/error",

    SignDocument: "/signDocument",

    // ApprovalContainer: "/approvalContainer", //전자결재 페이지
    // EstimatePopupContainer: "/estimatePopupContainer",
    // CostStatement: "/costStatement", //전자결재 페이지
    // LaborPreCostDoc: "/laborPreCostDoc", //인건비사전원가서 팝업
    // BusiCalculateDoc: "/buyingPreCostDoc", //구매사전원가서 팝업
    PreCostDoc: "/preCostDoc", //사전원가서 팝업
    ExecutionCostsDoc: "/executionCostsDoc", //실행원가서 팝업
    PostCostsDoc: "/postCostsDoc", //사후정산서 팝업

    LaborCostDoc: "/laborCostDoc", //인건비 갑지
    LaborSummaryDoc: "/laborSummaryDoc", //인건비상세내역
    OrderBuyDoc: "/orderBuyDoc", //구매비 갑지
    OrderSummaryDoc: "/OrderSummaryDoc", //구매비 갑지
    DetailDoc: "/DetailDoc", //구매비 갑지
    TotalDoc: "/TotalDoc", //구매비 갑지

    //REFERENCE 기준정보관리
    Reference: "/reference", //기준정보관리

    ItemMgmt: "/reference/item", //품목관리
    ItemGroupMgmt: "/reference/item/group", //품목관리>품목그룹관리
    ItemDetailMgmt: "/reference/item/detail", //품목관리>품목상세관리

    VendorMgmt: "/reference/vendor", //거래처관리
    CustomerMgmt: "/reference/vendor/customer", //거래처관리>고객사
    PartnerMgmt: "/reference/vendor/partner", //거래처관리>협력사

    BusinessMgmt: "/reference/business", //사업장관리

    UserMgmt: "/reference/user", //사용자관리
    WorkMemberMgmt: "/reference/user/work", //사용자관리>업무회원관리
    RegularMemberMgmt: "/reference/user/regular", //사용자관리>일반회원관리
    EnterpriseMemberMgmt: "/reference/user/enterprise", //사용자관리>기업회원관리
    PermissionGroupMgmt: "/reference/user/permission", //사용자관리>권한그룹정보관리
    OrganizationMgmt: "/reference/user/organization", //사용자관리>조직부서정보관리

    CostMgmt: "/reference/cost", //원가기준관리
    LaborRate: "/reference/cost/laborRate", //원가기준관리>인건비단가
    GradeWageLaborCost: "/reference/cost/gradeWageLaborCost", //원가기준관리>급별단가(인건비)
    GradeWageExpense: "/reference/cost/gradeWageExpense", //원가기준관리>급별단가(경비)
    CostIndex: "/reference/cost/CostIndex", //원가기준관리>사전원가지표

    //SALES 영업관리
    Sales: "/sales", //영업관리
    ProjectMgmt: "/sales/projectMgmt", //영업관리>프로젝트관리
    OrderPlanMgmt: "/sales/orderPlan", //영업관리>수주관리
    SalesExpenses: "/sales/expenses", //영업관리>영업비용
    Quotation: "/sales/quotation", //영업관리>견적관리
    InvoiceMgmt: "/sales/invoice", //영업관리>세금계산서발행관리
    ElectronicTaxInvoice: "/sales/tax", //영업관리>전자세금계산서
    OrderMgmt: "/sales/orderMgmt", //영업관리>수주관리

    //EXECUTION 실행관리
    Execution: "/execution", //실행관리
    ExecutionCost: "/execution/cost", //실행관리>실행원가
    DraftQuotation: "/execution/draft", //실행관리>실행원가
    LaborCostMgmt: "/execution/labor", //실행관리>인건비
    PurchasingMgmt: "/execution/purchasing", //실행관리>구매비
    ExpenseMgmt: "/execution/expense", //실행관리>경비

    // 전자결재
    PendingBox: "/mail/pendingBox", //전자결재>결재대기함
    ProgressBox: "/mail/progressBox", //전자결재>결재진행함
    CompletedBox: "/mail/completedBox", //전자결재>결재완료함
    ReturnBox: "/mail/returnBox", //전자결재>결재반려함
    CancelBox: "/mail/cancel", //전자결재>결재회수함

    //SYSTEM 시스템관리
    System: "/system", //시스템관리

    AuthorizationMgmt: "/system/authorization", //시스템관리>권한관리

    Menu: "/system/menu", //시스템관리>메뉴관리
    MenuInfo: "/system/menu/info", //시스템관리>메뉴관리>메뉴정보관리
    ProgramList: "/system/menu/programList", //시스템관리>프로그램목록관리

    BoardMgmt: "/system/board", //시스템관리>게시판관리
    PostMgmt: "/system/board/post", //시스템관리>게시판관리>게시물관리
    BoardMaster: "/system/board/master", //시스템관리>게시판관리>게시판마스터관리
    Comment: "/system/board/comment", //시스템관리>게시판관리>댓글관리
    BoardViewing: "/system/board/viewing", //시스템관리>게시판관리>게시판열람권한관리

    CodeMgmt: "/system/code", //시스템관리>코드관리
    CategoryCode: "/system/code/category", //시스템관리>코드관리>분류코드관리
    GroupCode: "/system/code/group", //시스템관리>코드관리>그룹코드관리
    DetailCode: "/system/code/detail", //시스템관리>코드관리>상세코드관리

    AccessHistoryMgmt: "/system/history", //시스템관리>접속이력관리

    //ADMIN
    ADMIN: "/admin", //관리자페이지
};

export default URL;
