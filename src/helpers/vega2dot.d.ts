import { View } from "vega-typings";

export function view2dot(view: View, stamp?: number): Promise<string>;
export function vega2dot(vgSpec: string): string;
export function scene2dot(view: View): string;
