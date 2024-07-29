import React from 'react';
import { NavLink } from 'react-router-dom';

const NavLinkTabs = ({ to, onClick, activeName, children, header, styled }) => {
	const handleClick = (e) => {
		if (onClick) {
			onClick(e, header); // header 파라미터 전달
		}
	};

	return (
		<NavLink
			to={to}
			className={`${activeName === children ? 'cur' : ''}${styled ? ` ${styled}` : ''}`}
			onClick={handleClick}
		>
			{children}
		</NavLink>
	);
};

export default NavLinkTabs;
