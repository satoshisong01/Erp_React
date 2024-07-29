import React, { useState, useEffect } from "react";

const MenuForm = ({selectNode}) => {

	const [formData, setFormData] = useState({
		// menuName: '', //메뉴명
		// menuCategory: '', //메뉴카테고리
		// upperMenuNo: 0, //상위메뉴번호
		// menuNo: 0, //메뉴번호
		// menuLv: 0, //메뉴레벨(읽기, 쓰기, 수정, 삭제)
		// menuOrder: 0, //메뉴순서
		// menuDc: '', //메뉴설명
		// rltImgPath: '', //이미지경로
		// rltImgNm: '', //이미지명
		// useAt: 'Y', //사용여부
		// targetAt: 'N', //새창여부
		// authorCode: '' //권한
	}); //수정할 노드의 정보

	useEffect(() => {
		console.log("❤️❤️❤️ selectNode --->>>", selectNode);
		setFormData(selectNode)
	}, [selectNode])

	const onChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
		console.log("❤️❤️❤️ [네임]:벨류 - [", name, "]: ", value);
	}

	return (
		<>
			<div className="form-container">
				<div className="row"> 
					<label className="col-md-2">
						<span className="text-danger">*</span>
						<span className="text-menu">메뉴명</span>
					</label>
					<label className="col-md-10">
						<input type="text" name="menuName" value={formData.menuName} onChange={onChange} className="form-control" />
					</label>
				</div>

				<div className="row">
					<label className="col-md-2 left-label">
						<span className="text-danger">*</span>
						<span className="text-menu">메뉴카테고리</span>
					</label>
					<label className="col-md-10 right-label">
						<select name="menuCategory" onChange={onChange} className="form-control">
							<option value="reference">기준정보관리</option>
							<option value="sales">영업관리</option>
							<option value="execution">실행관리</option>
							<option value="system">시스템관리</option>
						</select>
					</label>
				</div>

				<div className="row">
					<label className="col-md-2">
						<span className="text-danger">*</span>
						<span className="text-menu">상위메뉴번호</span>
					</label>
					<label className="col-md-10">
						<input type="text" name="upperMenuNo" value={formData.upperMenuNo} onChange={onChange} className="form-control" />
					</label>
				</div>

				<div className="row">
					<label className="col-md-2">
						<span className="text-danger">*</span>
						<span className="text-menu">메뉴레벨</span>
					</label>
					<label className="col-md-10">
						<label className="checkbox-area">
							<input type="checkbox" name="menuLv" value="0" onChange={onChange} className="checkbox"/>
							<span >미표시</span>
							<input type="checkbox" name="menuLv" value="1" onChange={onChange} className="checkbox"/>
							<span >읽기</span>
							<input type="checkbox" name="menuLv" value="2" onChange={onChange} className="checkbox"/>
							<span >쓰기</span>
							<input type="checkbox" name="menuLv" value="3" onChange={onChange} className="checkbox"/>
							<span >수정</span>
							<input type="checkbox" name="menuLv" value="4" onChange={onChange} className="checkbox"/>
							<span >삭제</span>
						</label>
					</label>
				</div>

				<div className="row">
					<label className="col-md-2">
						<span className="text-danger">*</span>
						<span className="text-menu">메뉴순서</span>
					</label>
					<label className="col-md-10">
						<input type="text" name="menuOrder" value={formData.menuOrder} onChange={onChange} className="form-control" />
					</label>
				</div>

				<div className="row">
					<label className="col-md-2">
						<span className="text-danger">*</span>
						<span className="text-menu">관계이미지경로</span>
					</label>
					<label className="col-md-10">
						<input type="text" name="rltImgPath" value={formData.rltImgPath} onChange={onChange} className="form-control" />
					</label>
				</div>

				<div className="row">
					<label className="col-md-2">
						<span className="text-danger">*</span>
						<span className="text-menu">관계이미지명</span>
					</label>
					<label className="col-md-10">
						<input type="text" name="rltImgNm" value={formData.rltImgNm} onChange={onChange} className="form-control" />
					</label>
				</div>

				<div className="row">
					<label className="col-md-2">
						<span className="text-danger">*</span>
						<span className="text-menu">사용여부</span>
					</label>
					<label className="col-md-10">
						<select name="useAt" onChange={onChange} className="form-control">
							<option value="1">Y</option>
							<option value="2">N</option>
						</select>
					</label>
				</div>

				<div className="row">
					<label className="col-md-2">
						<span className="text-danger">*</span>
						<span className="text-menu">새창여부</span>
					</label>
					<label className="col-md-10">
						<select name="targetAt" onChange={onChange} className="form-control">
							<option value="1">Y</option>
							<option value="2">N</option>
						</select>
					</label>
				</div>

				<div className="row">
					<label className="col-md-2">
						<span className="text-danger">*</span>
						<span className="text-menu">권한정보</span>
					</label>
					<label className="col-md-10">
						<select name="targetAt" onChange={onChange} className="form-control">
							<option value="ROLE_ADMIN">관리자</option>
							<option value="ROLE_MANAGER">운영자</option>
							<option value="ROLE_USER">일반사용자</option>
							<option value="ROLE_ANONYMOUS">익명사용자</option>
							<option value="ROLE_SUPER_MANAGER">test</option>
						</select>
					</label>
				</div>

				<div className="row">
					<button className='btn btn-primary btn-block'>저장</button>
				</div>
			</div>
		</>
	);

}

export default MenuForm;