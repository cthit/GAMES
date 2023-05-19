import { FC } from 'react';
import styles from './Legend.module.scss';

interface LegendItem {
	name: string;
	icon: FC<{ className?: string }>;
}

interface LegendProps {
	items: LegendItem[];
}

const Legend: FC<LegendProps> = ({ items }) => {
	return (
		<div className={styles.legend}>
			<h2 className={styles.legendTitle}>Legend</h2>
			<ul className={styles.legendItemList}>
				{items.map((item) => (
					<LegendItem key={item.name} {...item} />
				))}
			</ul>
		</div>
	);
};

const LegendItem: FC<LegendItem> = ({ name, icon: Icon }) => {
	return (
		<li className={styles.legendItem}>
			<Icon className={styles.legendItemIcon} />
			<p className={styles.legendItemText}>{name}</p>
		</li>
	);
};

export default Legend;
