package com.ouyeel.consumer.servicec.util;

import java.io.Serializable;
import java.net.InetAddress;


/**
 * <b>uuid.hex</b><br>
 * <br>
 * A <tt>UUIDHexGenerator</tt> that returns a string of length 32, This string
 * will consist of only hex digits. Optionally, the string may be generated with
 * separators between each component of the UUID.
 *
 * @author yiyong
 */

public class UUIDHexIdGenerator {
	private static final int IP;
	static {
		int ipadd;
		try {
			ipadd = toInt(InetAddress.getLocalHost().getAddress());
		} catch (Exception e) {
			ipadd = 0;
		}
		IP = ipadd;
	}

	private static short counter = (short) 0;

	private static final int JVM = (int) (System.currentTimeMillis() >>> 8);

	private static String sep = "";

	private static UUIDHexIdGenerator keygen = new UUIDHexIdGenerator();

	private UUIDHexIdGenerator() {
	}

	public static UUIDHexIdGenerator getInstance() {
		return keygen;
	}

	private static String format(int intval) {
		String formatted = Integer.toHexString(intval);
		StringBuffer buf = new StringBuffer("00000000");
		buf.replace(8 - formatted.length(), 8, formatted);
		return buf.toString();
	}

	private static String format(short shortval) {
		String formatted = Integer.toHexString(shortval);
		StringBuffer buf = new StringBuffer("0000");
		buf.replace(4 - formatted.length(), 4, formatted);
		return buf.toString();
	}

	public static synchronized Serializable generate() {
		return new StringBuffer(36).append(format(getIP())).append(sep).append(
				format(getJVM())).append(sep).append(format(getHiTime()))
				.append(sep).append(format(getLoTime())).append(sep).append(
						format(getCount())).toString();
	}

	/**
	 * Unique across JVMs on this machine (unless they load this class in the
	 * same quater second - very unlikely)
	 */
	private static int getJVM() {
		return JVM;
	}

	/**
	 * Unique in a millisecond for this JVM instance (unless there are >
	 * Short.MAX_VALUE instances created in a millisecond)
	 */
	private static short getCount() {
		synchronized (UUIDHexIdGenerator.class) {
			if (counter < 0) {
				counter = 0;
			}
			return counter++;
		}
	}

	/**
	 * Unique in a local network
	 */
	private static int getIP() {
		return IP;
	}

	/**
	 * Unique down to millisecond
	 */
	private static short getHiTime() {
		return (short) (System.currentTimeMillis() >>> 32);
	}

	private static int getLoTime() {
		return (int) System.currentTimeMillis();
	}

	private static int toInt(byte[] bytes) {
		int result = 0;
		for (int i = 0; i < 4; i++) {
			result = (result << 8) - Byte.MIN_VALUE + (int) bytes[i];
		}
		return result;
	}

	public Object nextId(String seed) {
		return generate();
	}

	public String nextStringId(String seed) {
		return generate().toString();
	}

}
