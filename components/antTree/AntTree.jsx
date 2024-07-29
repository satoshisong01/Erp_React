import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import './AntTreeStyle.css';

const { DirectoryTree } = Tree;

const AntTree = ({ treeData, selectData }) => {
	const [dataList, setDataList] = useState(treeData) //props로 초기화한 tree 구성 데이터

	useEffect(() => {
		setDataList(treeData);
	}, [treeData])


	const selectHandle = (e, treeNode) => {
        const { node } = treeNode;
        if (typeof node.key === "number") return;
		const nodeMap = {
            //사용자 관련
            ...node
			// menuName: treeNode.node.empId, //사용자아이디

            // 메뉴 관련
            // menuCategory: treeNode.node.menuCategory, //메뉴카테고리
            // upperMenuNo: treeNode.node.upperMenuNo, //상위메뉴번호
            // menuNo: treeNode.node.menuNo, //메뉴번호
            // menuLv: treeNode.node.menuLv, //메뉴레벨(읽기, 쓰기, 수정, 삭제)
            // menuOrder: treeNode.node.key, //메뉴현재순서
            // menuDc: treeNode.node.menuDc, //메뉴설명
            // rltImgPath: treeNode.node.rltImgPath, //이미지경로
            // rltImgNm: treeNode.node.rltImgNm, //이미지명
            // useAt: treeNode.node.useAt, //사용여부
            // targetAt: treeNode.node.targetAt, //새창여부
            // authorCode: treeNode.node.authorCode, //권한
            // disableExpand: treeNode.node.disableExpand //권한
		};
		selectData(nodeMap)
	}

	return (
		<>
			<DirectoryTree
				defaultExpandAll
				treeData={dataList}
				onSelect={selectHandle}
			/>
		</>
	);
};

export default AntTree;
