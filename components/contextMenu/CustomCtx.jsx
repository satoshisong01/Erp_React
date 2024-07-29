import React from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import './CustomCtxStyle.css';

const CustomCtx = ({ children, ctxData }) => {

	const handleItemClick = (event, data) => {
		if(data.name === 'create') {
			/** 구현 필요 */
		}
		else if (data.name === 'modify') {

		}
		else if (data.name === 'delete') {

		}
	};

  	return (
		<>
			<ContextMenuTrigger id="myContextMenu">
				{ children }
			</ContextMenuTrigger>

			<ContextMenu id="myContextMenu" className="context-menu">
				{ctxData.map((item, index) => (
					<MenuItem key={item} onClick={handleItemClick} data={{name: item}} className="context-menu-item">
						{item}
					</MenuItem>
				))}
			</ContextMenu>
		</>
 	);
};

export default CustomCtx;
