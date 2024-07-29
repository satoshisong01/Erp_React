import React from "react";
import URL from "constants/url";

//기준정보관리
import ItemGroupMgmt from "pages/reference/ItemGroupMgmt";
import ItemDetailMgmt from "pages/reference/ItemDetailMgmt";
import CustomerMgmt from "pages/reference/CustomerMgmt";
import PartnerMgmt from "pages/reference/PartnerMgmt";
import WorkMemberMgmt from "pages/reference/WorkMemberMgmt";
import PermissionGroupMgmt from "pages/reference/PermissionGroupMgmt";
import OrganizationMgmt from "pages/reference/OrganizationMgmt";
import LaborRate from "pages/reference/LaborRate";
import GradeWageLaborCost from "pages/reference/GradeWageLaborCost";
import GradeWageExpense from "pages/reference/GradeWageExpense";
import CostIndex from "pages/reference/CostIndex";
//영업관리
import ProjectMgmt from "pages/sales/ProjectMgmt";
import OrderPlanMgmt from "pages/sales/OrderPlanMgmt";
import SalesExpenses from "pages/sales/SalesExpenses";
import OrderMgmt from "pages/sales/OrderMgmt";
//실행관리
import ExecutionCost from "pages/execution/ExecutionCost";
import CompletionReport from "pages/execution/CompletionReport";
//시스템관리
import CategoryCode from "pages/system/CategoryCode";
import GroupCode from "pages/system/GroupCode";
import DetailCode from "pages/system/DetailCode";
import LaborCostMgmtExe from "pages/execution/LaborCostMgmtExe";
import LaborCostMgmtPlan from "pages/execution/LaborCostMgmtPlan";
import PurchasingMgmtPlan from "pages/execution/PurchasingMgmtPlan";
import PurchasingMgmtExe from "pages/execution/PurchasingMgmtExe";
import ExpenseMgmtExe from "pages/execution/ExpenseMgmtExe";
import ExpenseMgmtPlan from "pages/execution/ExpenseMgmtPlan";
import Quotation from "pages/sales/Quotation";
import PendingBox from "pages/mail/PendingBox";
import ProgressBox from "pages/mail/ProgressBox";
import CompletedBox from "pages/mail/CompletedBox";
import MenuInfo from "pages/system/menuMgmt/MenuInfo";
import ReturnBox from "pages/mail/ReturnBox";
import CancelBox from "pages/mail/CancelBox";



export const reference = [
    //기준정보관리
    {
        id: "ItemGroupMgmt",
        path: URL.ItemGroupMgmt,
        component: <ItemGroupMgmt />,
        label: "품목그룹",
        pLabel: "기준정보관리",
    },
    {
        id: "ItemDetailMgmt",
        path: URL.ItemDetailMgmt,
        component: <ItemDetailMgmt />,
        label: "품목상세",
        pLabel: "기준정보관리",
    },
    {
        id: "CustomerMgmt",
        path: URL.CustomerMgmt,
        component: <CustomerMgmt />,
        label: "고객사",
        pLabel: "기준정보관리",
    },
    {
        id: "PartnerMgmt",
        path: URL.PartnerMgmt,
        component: <PartnerMgmt />,
        label: "협력사",
        pLabel: "기준정보관리",
    },
    // {
    //     id: "BusinessMgmt",
    //     path: URL.BusinessMgmt,
    //     component: <BusinessMgmt />,
    //     label: "사업장관리",
    //     pLabel: "기준정보관리",
    //     activeKey: 104,
    // },
    {
        id: "PermissionGroupMgmt",
        path: URL.PermissionGroupMgmt,
        component: <PermissionGroupMgmt />,
        label: "권한그룹정보관리",
        pLabel: "기준정보관리",
    },
    {
        id: "OrganizationMgmt",
        path: URL.OrganizationMgmt,
        component: <OrganizationMgmt />,
        label: "조직부서정보관리",
        pLabel: "기준정보관리",
    },
    {
        id: "LaborRate",
        path: URL.LaborRate,
        component: <LaborRate />,
        label: "외주사인건비",
        pLabel: "기준정보관리",
    },
    {
        id: "GradeWageLaborCost",
        path: URL.GradeWageLaborCost,
        component: <GradeWageLaborCost />,
        label: "급별단가(인건비)",
        pLabel: "기준정보관리",
    },
    {
        id: "GradeWageExpense",
        path: URL.GradeWageExpense,
        component: <GradeWageExpense />,
        label: "급별단가(경비)",
        pLabel: "기준정보관리",
    },
    {
        id: "CostIndex",
        path: URL.CostIndex,
        component: <CostIndex />,
        label: "사전원가지표",
        pLabel: "기준정보관리",
    },
];
export const sales = [
    //영업관리
    {
        id: "ProjectMgmt",
        path: URL.ProjectMgmt,
        component: <ProjectMgmt />,
        label: "프로젝트관리",
        pLabel: "영업관리",
    },
    {
        id: "OrderPlanMgmt",
        path: URL.OrderPlanMgmt,
        component: <OrderPlanMgmt />,
        // label: "계획관리",
        label: "계획관리", //첫 페이지
        pLabel: "영업관리",
    },
    {
        id: "SalesExpenses",
        path: URL.SalesExpenses,
        component: <SalesExpenses />,
        label: "영업비(정산)",
        pLabel: "영업관리",
    },
    {
        id: "Quotation",
        path: URL.Quotation,
        component: <Quotation />,
        label: "견적관리",
        pLabel: "영업관리",
    },
    {
        id: "OrderMgmt",
        path: URL.OrderMgmt,
        component: <OrderMgmt />,
        label: "수주보고서",
        pLabel: "영업관리",
    },
    //{
    //    id: "InvoiceMgmt",
    //    path: URL.InvoiceMgmt,
    //    component: <InvoiceMgmt />,
    //    label: "세금계산서발행관리",
    //    activeKey: 204,
    //},
    //{
    //    id: "ElectronicTaxInvoice",
    //    path: URL.ElectronicTaxInvoice,
    //    component: <ElectronicTaxInvoice />,
    //    label: "전자세금계산서관리",
    //    activeKey: 205,
    //}
];
export const execution = [
    //실행관리
    {
        id: "ExecutionCost",
        path: URL.ExecutionCost,
        component: <ExecutionCost />,
        label: "원가조회",
        etc: "원가조회",
        pLabel: "실행관리",
    },
    {
        id: "LaborCostMgmtPlan", //계획인건비
        path: URL.LaborCostMgmtPlan,
        component: <LaborCostMgmtPlan />,
        label: "인건비",
        etc: "계획 인건비",
        pLabel: "실행관리",
    },
    {
        id: "LaborCostMgmtExe", //실행인건비
        path: URL.LaborCostMgmtExe,
        component: <LaborCostMgmtExe />,
        label: "인건비",
        etc: "실행 인건비",
        pLabel: "실행관리",
    },
    {
        id: "PurchasingMgmtPlan", //계획구매
        path: URL.PurchasingMgmtPlan,
        component: <PurchasingMgmtPlan />,
        label: "구매(재료비)",
        etc: "계획 구매(재료비)",
        pLabel: "실행관리",
    },
    {
        id: "PurchasingMgmtExe", //실행구매
        path: URL.PurchasingMgmtExe,
        component: <PurchasingMgmtExe />,
        label: "구매(재료비)",
        etc: "실행 구매(재료비)",
        pLabel: "실행관리",
    },
    {
        id: "ExpenseMgmtPlan", //계획경비
        path: URL.ExpenseMgmtPlan,
        component: <ExpenseMgmtPlan />,
        label: "경비",
        etc: "계획 경비",
        pLabel: "실행관리",
    },
    {
        id: "ExpenseMgmtExe", //실행경비
        path: URL.ExpenseMgmtExe,
        component: <ExpenseMgmtExe />,
        label: "경비",
        etc: "실행 경비",
        pLabel: "실행관리",
    },
    {
        id: "CompletionReport", //실행경비
        path: URL.CompletionReport,
        component: <CompletionReport />,
        label: "완료보고서",
        etc: "실행 경비",
        pLabel: "실행관리",
    },

];
export const mail = [
    //전자결재
    {
        id: "PendingBox",
        path: URL.PendingBox,
        component: <PendingBox />,
        label: "결재대기함",
        pLabel: "전자결재",
     },
    {
        id: "ProgressBox",
        path: URL.ProgressBox,
        component: <ProgressBox />,
        label: "결재진행함",
        pLabel: "전자결재",
     },
    {
        id: "CompletedBox",
        path: URL.CompletedBox,
        component: <CompletedBox />,
        label: "결재완료함",
        pLabel: "전자결재",
     },
    {
        id: "ReturnBox",
        path: URL.ReturnBox,
        component: <ReturnBox />,
        label: "결재반려함",
        pLabel: "전자결재",
     },
    {
        id: "CancelBox",
        path: URL.CancelBox,
        component: <CancelBox/>,
        label: "결재회수함",
        pLabel: "전자결재",
     },
];
export const system = [
    //시스템관리
    {
        id: "MenuInfo",
        path: URL.MenuInfo,
        component: <MenuInfo />,
        label: "메뉴정보관리",
        pLabel: "시스템관리",
    },
    // {
    //     id: "ProgramList",
    //     path: URL.ProgramList,
    //     component: <ProgramList />,
    //     label: "프로그램목록관리",
    //     pLabel: "시스템관리",
    // },
    // {
    //     id: "AuthorizationMgmt",
    //     path: URL.AuthorizationMgmt,
    //     component: <AuthorizationMgmt />,
    //     label: "권한관리",
    //     pLabel: "시스템관리",
    // },
    {
        id: "GroupCode",
        path: URL.GroupCode,
        component: <GroupCode />,
        label: "그룹코드",
        pLabel: "시스템관리",
    },
    {
        id: "CategoryCode",
        path: URL.CategoryCode,
        component: <CategoryCode />,
        label: "공통코드",
        pLabel: "시스템관리",
    },
    {
        id: "DetailCode",
        path: URL.DetailCode,
        component: <DetailCode />,
        label: "상세코드",
        pLabel: "시스템관리",
    },
    {
        id: "WorkMemberMgmt",
        path: URL.WorkMemberMgmt,
        component: <WorkMemberMgmt />,
        label: "업무회원",
        pLabel: "시스템관리",
    },
    // {
    //     id: "RegularMemberMgmt",
    //     path: URL.RegularMemberMgmt,
    //     component: <RegularMemberMgmt />,
    //     label: "일반회원",
    //     pLabel: "기준정보관리",
    // },
    // {
    //     id: "EnterpriseMemberMgmt",
    //     path: URL.EnterpriseMemberMgmt,
    //     component: <EnterpriseMemberMgmt />,
    //     label: "기업회원",
    //     pLabel: "기준정보관리",
    // },
    // {
    //     id: "AccessHistoryMgmt",
    //     path: URL.AccessHistoryMgmt,
    //     component: <AccessHistoryMgmt />,
    //     label: "접속이력관리",
    // },

    // {
    //     id: "PostMgmt",
    //     path: URL.PostMgmt,
    //     component: <PostMgmt />,
    //     label: "게시물관리",
    // },
    // {
    //     id: "BoardMaster",
    //     path: URL.BoardMaster,
    //     component: <BoardMaster />,
    //     label: "게시판마스터관리",
    // },
    // {
    //     id: "Comment",
    //     path: URL.Comment,
    //     component: <Comment />,
    //     label: "댓글관리",
    // },
    // {
    //     id: "BoardViewing",
    //     path: URL.BoardViewing,
    //     component: <BoardViewing />,
    //     label: "게시판열람권한관리",
    // },
];

export const Children = [...reference, ...sales, ...execution, ...mail, ...system];
