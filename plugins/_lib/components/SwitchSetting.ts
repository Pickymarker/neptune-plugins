import { $, html } from "@neptune/voby";

type SwitchSettingProps = { checked: boolean; onClick?: () => void; title: string };
export const SwitchSetting = ({ checked, onClick, title }: SwitchSettingProps) => {
	checked ??= false;
	return html`
		<div style="margin-bottom: 15px;display: flex;justify-content: space-between;">
			<label for="switch-${title}" style="font-size: 1.2em;margin-bottom: 5px;">${title}</label>
			<input id="switch-${title}" class="neptune-switch-checkbox" type="checkbox" checked=${checked} />
			<span onClick=${onClick} class="neptune-switch" />
		</div>
	`;
};
